<?php
/**
 * Plugin Name: UNETI Solicitudes
 * Description: Registra las solicitudes de admisión y contacto como CPT privado, las expone por REST y las hace exportables.
 * Version: 1.0.0
 *
 * Flujo:
 *   Next.js -> POST /wp-json/uneti/v1/solicitudes (token) -> wp_insert_post()
 *   -> wp_posts + wp_postmeta + taxonomía estado_solicitud.
 */

defined( 'ABSPATH' ) || exit;

const UNETI_SOLICITUD_CPT          = 'solicitud_uneti';
const UNETI_SOLICITUD_TAX          = 'estado_solicitud';
const UNETI_SOLICITUD_RATE_MAX     = 5;
const UNETI_SOLICITUD_RATE_GLOBAL  = 200;
const UNETI_SOLICITUD_ESTADOS      = array(
	'nueva'       => 'Nueva',
	'en_revision' => 'En revisión',
	'contactada'  => 'Contactada',
	'admitida'    => 'Admitida',
	'descartada'  => 'Descartada',
);

/**
 * Programas válidos por tipo de solicitud. Los PNFA se listan con la misma
 * etiqueta que envía el frontend (`app/lib/posgrados.ts`).
 */
const UNETI_SOLICITUD_PROGRAMAS_ADMISION = array(
	'PNF en Telecomunicaciones',
	'PNF en Informática',
);

const UNETI_SOLICITUD_PROGRAMAS_POSGRADO = array(
	'Especialización y Maestría en Gestión de Operaciones Satelitales (PNFA-OPSAT)',
	'Especialización y Maestría en Ciberseguridad',
	'Especialización y Maestría en Automatización, Control y Robótica (PNFA-ACR)',
	'Especialización y Maestría en Economía Digital y Tecnologías Blockchain',
	'Especialización y Maestría en Gestión en Telecomunicaciones (PNFA-GT)',
	'Especialización y Maestría en Interoperabilidad y Bases de Datos',
	'Doctorado en Gerencia Evaluativa Tecnológica, Empresarial y Educativa',
);

/**
 * Etiqueta legible del tipo de solicitud (título, panel, CSV y correo).
 */
function uneti_solicitud_etiqueta_tipo( $tipo ) {
	switch ( $tipo ) {
		case 'admision':
			return 'Admisión';
		case 'posgrado':
			return 'Posgrado';
		default:
			return 'Contacto';
	}
}


add_action( 'init', 'uneti_solicitud_registrar_cpt' );
add_action( 'init', 'uneti_solicitud_registrar_taxonomia' );
add_action( 'init', 'uneti_solicitud_crear_estados' );
add_action( 'rest_api_init', 'uneti_solicitud_registrar_rest' );

/**
 * Registra el Custom Post Type privado de solicitudes.
 */
function uneti_solicitud_registrar_cpt() {
	register_post_type(
		UNETI_SOLICITUD_CPT,
		array(
			'labels'             => array(
				'name'               => 'Solicitudes UNETI',
				'singular_name'      => 'Solicitud',
				'menu_name'          => 'Solicitudes',
				'name_admin_bar'     => 'Solicitud',
				'all_items'          => 'Todas las solicitudes',
				'edit_item'          => 'Ver solicitud',
				'view_item'          => 'Ver solicitud',
				'search_items'       => 'Buscar solicitudes',
				'not_found'          => 'No hay solicitudes registradas.',
				'not_found_in_trash' => 'No hay solicitudes en la papelera.',
			),
			'public'             => false,
			'publicly_queryable' => false,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'show_in_rest'       => false,
			'query_var'          => false,
			'rewrite'            => false,
			'capability_type'    => 'post',
			'map_meta_cap'       => true,
			'capabilities'       => array(
				'create_posts' => 'do_not_allow',
			),
			'supports'           => array( 'title' ),
			'menu_icon'          => 'dashicons-email-alt',
			'menu_position'      => 26,
		)
	);
}

/**
 * Taxonomía interna para el flujo de trabajo del analista.
 */
function uneti_solicitud_registrar_taxonomia() {
	register_taxonomy(
		UNETI_SOLICITUD_TAX,
		array( UNETI_SOLICITUD_CPT ),
		array(
			'labels'            => array(
				'name'          => 'Estados',
				'singular_name' => 'Estado',
				'menu_name'     => 'Estados',
				'all_items'     => 'Todos los estados',
				'edit_item'     => 'Editar estado',
				'add_new_item'  => 'Añadir estado',
				'search_items'  => 'Buscar estados',
			),
			'public'            => false,
			'show_ui'           => true,
			'show_admin_column' => true,
			'hierarchical'      => false,
			'show_in_rest'      => false,
			'rewrite'           => false,
		)
	);
}

/**
 * Crea los estados una sola vez. Es idempotente.
 */
function uneti_solicitud_crear_estados() {
	if ( ! taxonomy_exists( UNETI_SOLICITUD_TAX ) ) {
		return;
	}

	foreach ( UNETI_SOLICITUD_ESTADOS as $slug => $nombre ) {
		if ( ! term_exists( $slug, UNETI_SOLICITUD_TAX ) ) {
			wp_insert_term( $nombre, UNETI_SOLICITUD_TAX, array( 'slug' => $slug ) );
		}
	}
}

/**
 * Registra el endpoint de recepción. Solo acepta POST autenticado por token.
 */
function uneti_solicitud_registrar_rest() {
	register_rest_route(
		'uneti/v1',
		'/solicitudes',
		array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => 'uneti_solicitud_crear',
				'permission_callback' => 'uneti_solicitud_autorizar',
			),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => 'uneti_solicitud_metodo_no_permitido',
				'permission_callback' => '__return_true',
			),
		)
	);
}

function uneti_solicitud_metodo_no_permitido() {
	return new WP_Error(
		'uneti_solicitud_metodo',
		'Método no permitido.',
		array( 'status' => 405 )
	);
}

/**
 * Token compartido entre Next.js y WordPress. Nunca se expone al navegador.
 */
function uneti_solicitud_token() {
	if ( defined( 'UNETI_FORM_TOKEN' ) ) {
		return (string) UNETI_FORM_TOKEN;
	}

	return (string) getenv( 'UNETI_FORM_TOKEN' );
}

function uneti_solicitud_autorizar( WP_REST_Request $request ) {
	$token = uneti_solicitud_token();

	if ( '' === $token ) {
		return new WP_Error(
			'uneti_solicitud_sin_token',
			'El servicio de solicitudes no está configurado.',
			array( 'status' => 503 )
		);
	}

	$recibido = (string) $request->get_header( 'x-uneti-token' );

	if ( '' === $recibido || ! hash_equals( $token, $recibido ) ) {
		return new WP_Error(
			'uneti_solicitud_no_autorizada',
			'No autorizado.',
			array( 'status' => 403 )
		);
	}

	return true;
}

function uneti_solicitud_longitud( $texto ) {
	return function_exists( 'mb_strlen' ) ? mb_strlen( $texto ) : strlen( $texto );
}

/**
 * IP real del visitante. Next.js la reenvía; el endpoint está protegido por token.
 */
function uneti_solicitud_ip( WP_REST_Request $request ) {
	$ip = (string) $request->get_header( 'x-uneti-client-ip' );

	if ( ! filter_var( $ip, FILTER_VALIDATE_IP ) ) {
		$ip = isset( $_SERVER['REMOTE_ADDR'] )
			? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) )
			: '0.0.0.0';
	}

	return $ip;
}

/**
 * Límite por IP y límite global por hora.
 */
function uneti_solicitud_limitar( $ip ) {
	$clave  = 'uneti_solicitud_' . md5( $ip );
	$conteo = (int) get_transient( $clave );

	if ( $conteo >= UNETI_SOLICITUD_RATE_MAX ) {
		return new WP_Error(
			'uneti_solicitud_limite',
			'Demasiadas solicitudes. Inténtalo más tarde.',
			array( 'status' => 429 )
		);
	}

	set_transient( $clave, $conteo + 1, HOUR_IN_SECONDS );

	$global = (int) get_transient( 'uneti_solicitud_global' );
	if ( $global >= UNETI_SOLICITUD_RATE_GLOBAL ) {
		return new WP_Error(
			'uneti_solicitud_limite_global',
			'El servicio recibió demasiadas solicitudes. Inténtalo más tarde.',
			array( 'status' => 429 )
		);
	}

	set_transient( 'uneti_solicitud_global', $global + 1, HOUR_IN_SECONDS );

	return true;
}

/**
 * Valida el payload, inserta la solicitud y devuelve el folio.
 */
function uneti_solicitud_crear( WP_REST_Request $request ) {
	$ip     = uneti_solicitud_ip( $request );
	$limite = uneti_solicitud_limitar( $ip );

	if ( is_wp_error( $limite ) ) {
		return $limite;
	}

	// Honeypot: un bot recibe un éxito falso y no se guarda nada.
	if ( '' !== sanitize_text_field( (string) $request->get_param( 'sitio_web' ) ) ) {
		$respuesta = rest_ensure_response(
			array(
				'ok'    => true,
				'folio' => null,
			)
		);
		$respuesta->set_status( 201 );
		return $respuesta;
	}

	$inicio = $request->get_param( 'inicio' );
	if ( is_numeric( $inicio ) && ( time() * 1000 - (float) $inicio ) < 2500 ) {
		return new WP_Error(
			'uneti_solicitud_rapida',
			'La solicitud se envió demasiado rápido. Inténtalo de nuevo.',
			array( 'status' => 400 )
		);
	}

	$tipo = sanitize_key( (string) $request->get_param( 'tipo' ) );
	if ( ! in_array( $tipo, array( 'admision', 'contacto', 'posgrado' ), true ) ) {
		return new WP_Error( 'uneti_solicitud_tipo', 'El tipo de solicitud no es válido.', array( 'status' => 400 ) );
	}

	$nombre = sanitize_text_field( (string) $request->get_param( 'nombre' ) );
	if ( uneti_solicitud_longitud( $nombre ) < 2 || uneti_solicitud_longitud( $nombre ) > 120 ) {
		return new WP_Error( 'uneti_solicitud_nombre', 'El nombre no es válido.', array( 'status' => 400 ) );
	}

	$correo = sanitize_email( (string) $request->get_param( 'correo' ) );
	if ( ! is_email( $correo ) ) {
		return new WP_Error( 'uneti_solicitud_correo', 'El correo no es válido.', array( 'status' => 400 ) );
	}

	$telefono_crudo   = sanitize_text_field( (string) $request->get_param( 'telefono' ) );
	$telefono_digitos = preg_replace( '/\D/', '', $telefono_crudo );
	if (
		! preg_match( '/^[+()\d\s.-]+$/', $telefono_crudo ) ||
		strlen( $telefono_digitos ) < 7 ||
		strlen( $telefono_digitos ) > 15
	) {
		return new WP_Error( 'uneti_solicitud_telefono', 'El teléfono no es válido.', array( 'status' => 400 ) );
	}

	$cedula_cruda = preg_replace( '/\D/', '', sanitize_text_field( (string) $request->get_param( 'cedula' ) ) );
	if ( '' !== $cedula_cruda && ! preg_match( '/^\d{5,10}$/', $cedula_cruda ) ) {
		return new WP_Error( 'uneti_solicitud_cedula', 'La cédula no es válida.', array( 'status' => 400 ) );
	}

	if ( in_array( $tipo, array( 'admision', 'posgrado' ), true ) && '' === $cedula_cruda ) {
		return new WP_Error( 'uneti_solicitud_cedula_requerida', 'La cédula es obligatoria.', array( 'status' => 400 ) );
	}

	$programa = sanitize_text_field( (string) $request->get_param( 'programa' ) );
	$programas_permitidos = 'posgrado' === $tipo
		? UNETI_SOLICITUD_PROGRAMAS_POSGRADO
		: UNETI_SOLICITUD_PROGRAMAS_ADMISION;

	if ( $programa !== '' && ! in_array( $programa, $programas_permitidos, true ) ) {
		return new WP_Error( 'uneti_solicitud_programa', 'El programa no es válido.', array( 'status' => 400 ) );
	}

	if ( in_array( $tipo, array( 'admision', 'posgrado' ), true ) && '' === $programa ) {
		return new WP_Error(
			'uneti_solicitud_programa_requerido',
			'posgrado' === $tipo ? 'Selecciona un posgrado.' : 'Selecciona un PNF.',
			array( 'status' => 400 )
		);
	}

	$asunto = sanitize_text_field( (string) $request->get_param( 'asunto' ) );
	if ( uneti_solicitud_longitud( $asunto ) > 160 ) {
		return new WP_Error( 'uneti_solicitud_asunto', 'El asunto es demasiado largo.', array( 'status' => 400 ) );
	}

	$mensaje = sanitize_textarea_field( (string) $request->get_param( 'mensaje' ) );
	if ( uneti_solicitud_longitud( $mensaje ) > 2000 ) {
		return new WP_Error( 'uneti_solicitud_mensaje', 'El mensaje es demasiado largo.', array( 'status' => 400 ) );
	}

	if ( ! rest_sanitize_boolean( $request->get_param( 'consentimiento' ) ) ) {
		return new WP_Error( 'uneti_solicitud_consentimiento', 'Debes autorizar el tratamiento de datos.', array( 'status' => 400 ) );
	}

	$origen = esc_url_raw( (string) $request->get_param( 'origen' ) );
	if ( '' === $origen ) {
		$origen = home_url( '/' );
	}

	$datos = array(
		'tipo'           => $tipo,
		'nombre'         => $nombre,
		'cedula'         => $cedula_cruda,
		'correo'         => $correo,
		'telefono'       => $telefono_crudo,
		'programa'       => $programa,
		'asunto'         => $asunto,
		'mensaje'        => $mensaje,
		'consentimiento' => 'si',
		'origen'         => $origen,
		'ip'             => $ip,
	);

	$resultado = uneti_solicitud_insertar( $datos );

	if ( is_wp_error( $resultado ) ) {
		return $resultado;
	}

	do_action( 'uneti_solicitud_creada', $resultado['id'], $datos, $resultado['folio'] );
	uneti_solicitud_notificar( $resultado['id'], $datos, $resultado['folio'] );

	$respuesta = rest_ensure_response(
		array(
			'ok'     => true,
			'folio'  => $resultado['folio'],
			'ticket' => $resultado['folio'],
			'id'     => $resultado['id'],
		)
	);
	$respuesta->set_status( 201 );

	return $respuesta;
}

/**
 * Inserta el CPT, los metadatos y el estado inicial.
 */
function uneti_solicitud_insertar( array $datos ) {
	$etiqueta = strtolower( uneti_solicitud_etiqueta_tipo( $datos['tipo'] ) );
	$titulo   = sprintf(
		'Solicitud de %s — %s — %s',
		$etiqueta,
		$datos['nombre'],
		wp_date( 'Y-m-d H:i' )
	);

	$post_id = wp_insert_post(
		array(
			'post_type'    => UNETI_SOLICITUD_CPT,
			'post_status'  => 'private',
			'post_title'   => $titulo,
			'post_content' => '',
			'post_author'  => get_current_user_id(),
		),
		true
	);

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		return new WP_Error(
			'uneti_solicitud_guardado',
			'No se pudo guardar la solicitud.',
			array( 'status' => 500 )
		);
	}

	$folio = sprintf( 'UNETI-%s-%06d', wp_date( 'Y' ), $post_id );

	$meta = array(
		'_uneti_folio'          => $folio,
		'_uneti_tipo'           => $datos['tipo'],
		'_uneti_nombre'         => $datos['nombre'],
		'_uneti_cedula'         => $datos['cedula'],
		'_uneti_correo'         => $datos['correo'],
		'_uneti_telefono'       => $datos['telefono'],
		'_uneti_programa'       => $datos['programa'],
		'_uneti_asunto'         => $datos['asunto'],
		'_uneti_mensaje'        => $datos['mensaje'],
		'_uneti_consentimiento' => $datos['consentimiento'],
		'_uneti_origen'         => $datos['origen'],
		'_uneti_fecha'          => current_time( 'mysql' ),
		'_uneti_ip_hash'        => hash_hmac( 'sha256', $datos['ip'], wp_salt( 'auth' ) ),
		'_uneti_user_agent'     => isset( $_SERVER['HTTP_USER_AGENT'] )
			? substr( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ), 0, 255 )
			: '',
	);

	foreach ( $meta as $clave => $valor ) {
		update_post_meta( $post_id, $clave, $valor );
	}

	wp_set_object_terms( $post_id, 'nueva', UNETI_SOLICITUD_TAX );

	return array(
		'id'    => (int) $post_id,
		'folio' => $folio,
	);
}

/* ==========================================
   Administración: columnas, detalle y exportación
   ========================================== */

add_filter( 'manage_' . UNETI_SOLICITUD_CPT . '_posts_columns', 'uneti_solicitud_columnas' );

function uneti_solicitud_columnas( $columnas ) {
	$nuevas = array();

	foreach ( $columnas as $clave => $etiqueta ) {
		if ( 'title' === $clave ) {
			$nuevas['uneti_folio']    = 'Folio';
			$nuevas['uneti_nombre']   = 'Nombre';
			$nuevas['uneti_correo']   = 'Correo';
			$nuevas['uneti_telefono'] = 'Teléfono';
			$nuevas['uneti_programa'] = 'Programa';
			$nuevas['uneti_tipo']     = 'Tipo';
			continue;
		}

		$nuevas[ $clave ] = $etiqueta;
	}

	return $nuevas;
}

add_action( 'manage_' . UNETI_SOLICITUD_CPT . '_posts_custom_column', 'uneti_solicitud_columna_valor', 10, 2 );

function uneti_solicitud_columna_valor( $columna, $post_id ) {
	$folio    = (string) get_post_meta( $post_id, '_uneti_folio', true );
	$nombre   = (string) get_post_meta( $post_id, '_uneti_nombre', true );
	$correo   = (string) get_post_meta( $post_id, '_uneti_correo', true );
	$telefono = (string) get_post_meta( $post_id, '_uneti_telefono', true );
	$programa = (string) get_post_meta( $post_id, '_uneti_programa', true );
	$tipo     = (string) get_post_meta( $post_id, '_uneti_tipo', true );

	switch ( $columna ) {
		case 'uneti_folio':
			echo '<strong>' . esc_html( $folio ) . '</strong>';
			break;
		case 'uneti_nombre':
			echo esc_html( $nombre );
			break;
		case 'uneti_correo':
			echo '<a href="mailto:' . esc_attr( $correo ) . '">' . esc_html( $correo ) . '</a>';
			break;
		case 'uneti_telefono':
			echo esc_html( $telefono );
			break;
		case 'uneti_programa':
			echo esc_html( '' !== $programa ? $programa : '—' );
			break;
		case 'uneti_tipo':
			echo esc_html( uneti_solicitud_etiqueta_tipo( $tipo ) );
			break;
	}
}

add_action( 'add_meta_boxes', 'uneti_solicitud_meta_boxes' );

function uneti_solicitud_meta_boxes() {
	add_meta_box(
		'uneti_solicitud_datos',
		'Datos de la solicitud',
		'uneti_solicitud_meta_box',
		UNETI_SOLICITUD_CPT,
		'normal',
		'high'
	);
}

function uneti_solicitud_meta_box( $post ) {
	$campos = array(
		'Folio'          => get_post_meta( $post->ID, '_uneti_folio', true ),
		'Tipo'           => uneti_solicitud_etiqueta_tipo( get_post_meta( $post->ID, '_uneti_tipo', true ) ),
		'Nombre'         => get_post_meta( $post->ID, '_uneti_nombre', true ),
		'Cédula'         => get_post_meta( $post->ID, '_uneti_cedula', true ),
		'Correo'         => get_post_meta( $post->ID, '_uneti_correo', true ),
		'Teléfono'       => get_post_meta( $post->ID, '_uneti_telefono', true ),
		'Programa'       => get_post_meta( $post->ID, '_uneti_programa', true ),
		'Asunto'         => get_post_meta( $post->ID, '_uneti_asunto', true ),
		'Mensaje'        => get_post_meta( $post->ID, '_uneti_mensaje', true ),
		'Consentimiento' => get_post_meta( $post->ID, '_uneti_consentimiento', true ),
		'Origen'         => get_post_meta( $post->ID, '_uneti_origen', true ),
		'Fecha'          => get_post_meta( $post->ID, '_uneti_fecha', true ),
		'IP'             => 'Registrada como hash',
		'Navegador'      => get_post_meta( $post->ID, '_uneti_user_agent', true ),
	);

	echo '<table class="widefat striped">';
	echo '<tbody>';

	foreach ( $campos as $etiqueta => $valor ) {
		if ( is_array( $valor ) ) {
			$valor = implode( ', ', $valor );
		}
		$valor = (string) $valor;

		echo '<tr>';
		echo '<th style="width:180px">' . esc_html( $etiqueta ) . '</th>';
		echo '<td>';

		if ( 'Correo' === $etiqueta && is_email( $valor ) ) {
			echo '<a href="mailto:' . esc_attr( $valor ) . '">' . esc_html( $valor ) . '</a>';
		} elseif ( 'Teléfono' === $etiqueta && '' !== $valor ) {
			echo '<a href="tel:' . esc_attr( preg_replace( '/[^\d+]/', '', $valor ) ) . '">' . esc_html( $valor ) . '</a>';
		} elseif ( 'Origen' === $etiqueta && '' !== $valor ) {
			echo '<a href="' . esc_url( $valor ) . '" target="_blank" rel="noreferrer">' . esc_html( $valor ) . '</a>';
		} elseif ( 'Mensaje' === $etiqueta && '' !== $valor ) {
			echo nl2br( esc_html( $valor ) );
		} elseif ( '' === $valor ) {
			echo '—';
		} else {
			echo esc_html( $valor );
		}

		echo '</td>';
		echo '</tr>';
	}

	echo '</tbody>';
	echo '</table>';
	echo '<p style="margin-top:12px;color:#b32d2e"><strong>Datos personales:</strong> comparte esta información solo con el equipo autorizado de admisiones.</p>';
}

/* ==========================================
   Exportación CSV y notificación
   ========================================== */

add_action( 'restrict_manage_posts', 'uneti_solicitud_boton_exportar' );

function uneti_solicitud_boton_exportar( $post_type ) {
	if ( UNETI_SOLICITUD_CPT !== $post_type || ! current_user_can( 'edit_others_posts' ) ) {
		return;
	}

	$url = wp_nonce_url(
		admin_url( 'admin-post.php?action=uneti_exportar_solicitudes' ),
		'uneti_exportar_solicitudes'
	);

	echo '<a class="button" href="' . esc_url( $url ) . '" style="margin-left:8px">Exportar CSV</a>';
}

add_action( 'admin_post_uneti_exportar_solicitudes', 'uneti_solicitud_exportar_csv' );

/**
 * Evita que Excel interprete un valor como fórmula.
 */
function uneti_solicitud_csv_seguro( $valor ) {
	$valor = (string) $valor;

	if ( '' !== $valor && in_array( $valor[0], array( '=', '+', '-', '@' ), true ) ) {
		return "'" . $valor;
	}

	return $valor;
}

function uneti_solicitud_exportar_csv() {
	if ( ! current_user_can( 'edit_others_posts' ) ) {
		wp_die( 'No autorizado.', '', array( 'response' => 403 ) );
	}

	check_admin_referer( 'uneti_exportar_solicitudes' );

	$solicitudes = get_posts(
		array(
			'post_type'      => UNETI_SOLICITUD_CPT,
			'post_status'    => array( 'private', 'publish' ),
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	nocache_headers();
	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="solicitudes-uneti-' . gmdate( 'Ymd-His' ) . '.csv"' );

	$salida = fopen( 'php://output', 'w' );
	fwrite( $salida, "\xEF\xBB\xBF" );
	fputcsv(
		$salida,
		array( 'Folio', 'Fecha', 'Tipo', 'Nombre', 'Cédula', 'Correo', 'Teléfono', 'Programa', 'Asunto', 'Mensaje', 'Consentimiento', 'Estado', 'Origen' ),
		';'
	);

	foreach ( $solicitudes as $solicitud ) {
		$terminos = get_the_terms( $solicitud->ID, UNETI_SOLICITUD_TAX );
		$estado   = 'Nueva';

		if ( $terminos && ! is_wp_error( $terminos ) ) {
			$estado = implode( ', ', wp_list_pluck( $terminos, 'name' ) );
		}

		$fila = array(
			get_post_meta( $solicitud->ID, '_uneti_folio', true ),
			get_post_meta( $solicitud->ID, '_uneti_fecha', true ),
			uneti_solicitud_etiqueta_tipo( get_post_meta( $solicitud->ID, '_uneti_tipo', true ) ),
			get_post_meta( $solicitud->ID, '_uneti_nombre', true ),
			get_post_meta( $solicitud->ID, '_uneti_cedula', true ),
			get_post_meta( $solicitud->ID, '_uneti_correo', true ),
			get_post_meta( $solicitud->ID, '_uneti_telefono', true ),
			get_post_meta( $solicitud->ID, '_uneti_programa', true ),
			get_post_meta( $solicitud->ID, '_uneti_asunto', true ),
			get_post_meta( $solicitud->ID, '_uneti_mensaje', true ),
			get_post_meta( $solicitud->ID, '_uneti_consentimiento', true ),
			$estado,
			get_post_meta( $solicitud->ID, '_uneti_origen', true ),
		);

		fputcsv( $salida, array_map( 'uneti_solicitud_csv_seguro', $fila ), ';' );
	}

	fclose( $salida );
	exit;
}

/**
 * Notifica al administrador sin bloquear el guardado si el correo falla.
 */
function uneti_solicitud_notificar( $post_id, $datos, $folio ) {
	if ( ! apply_filters( 'uneti_notificar_solicitud', true, $post_id ) ) {
		return;
	}

	$destino = get_option( 'admin_email' );
	if ( ! is_email( $destino ) ) {
		return;
	}

	$cuerpo = array(
		'Folio: ' . $folio,
		'Tipo: ' . uneti_solicitud_etiqueta_tipo( $datos['tipo'] ),
		'Nombre: ' . $datos['nombre'],
		'Correo: ' . $datos['correo'],
		'Teléfono: ' . $datos['telefono'],
	);

	if ( '' !== $datos['programa'] ) {
		$cuerpo[] = 'Programa: ' . $datos['programa'];
	}

	if ( '' !== $datos['mensaje'] ) {
		$cuerpo[] = 'Mensaje: ' . $datos['mensaje'];
	}

	$cuerpo[] = '';
	$cuerpo[] = 'Revisa la solicitud en: ' . admin_url( 'post.php?post=' . (int) $post_id . '&action=edit' );

	wp_mail(
		$destino,
		'[UNETI] Nueva solicitud ' . $folio,
		implode( "\n", $cuerpo ),
		array( 'Content-Type: text/plain; charset=UTF-8' )
	);
}

add_action(
	'admin_notices',
	function () {
		if ( ! current_user_can( 'manage_options' ) || '' !== uneti_solicitud_token() ) {
			return;
		}

		echo '<div class="notice notice-warning"><p>';
		echo '<strong>UNETI Solicitudes:</strong> define <code>UNETI_FORM_TOKEN</code> en el entorno para habilitar el formulario.';
		echo '</p></div>';
	}
);




