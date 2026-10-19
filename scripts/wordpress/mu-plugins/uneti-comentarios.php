<?php
/**
 * Plugin Name: UNETI Comentarios
 * Description: Expone los comentarios nativos de WordPress en texto plano para el frontend headless.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'uneti/v1',
			'/comentarios/(?P<slug>[a-zA-Z0-9_-]+)',
			array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => 'uneti_comentarios_listar',
					'permission_callback' => '__return_true',
					'args'                => array(
						'slug' => array(
							'required'          => true,
							'sanitize_callback' => 'sanitize_title',
						),
					),
				),
				array(
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => 'uneti_comentarios_crear',
					'permission_callback' => '__return_true',
					'args'                => array(
						'slug' => array(
							'required'          => true,
							'sanitize_callback' => 'sanitize_title',
						),
					),
				),
			)
		);
	}
);

function uneti_comentarios_post( $slug ) {
	$post = get_page_by_path( $slug, OBJECT, 'post' );

	if ( ! $post || 'publish' !== $post->post_status ) {
		return new WP_Error(
			'uneti_noticia_no_encontrada',
			'La noticia no existe o no está publicada.',
			array( 'status' => 404 )
		);
	}

	return $post;
}

function uneti_comentarios_formatear( $comment ) {
	$avatar = get_avatar_url( $comment, array( 'size' => 96 ) );

	return array(
		'id'        => (int) $comment->comment_ID,
		'nombre'    => $comment->comment_author,
		'contenido' => wp_strip_all_tags( $comment->comment_content ),
		'fechaISO'  => mysql2date( 'c', $comment->comment_date_gmt, false ),
		'avatar'    => $avatar ? esc_url_raw( $avatar ) : null,
	);
}

function uneti_comentarios_listar( WP_REST_Request $request ) {
	$post = uneti_comentarios_post( $request->get_param( 'slug' ) );

	if ( is_wp_error( $post ) ) {
		return $post;
	}

	$comments = get_comments(
		array(
			'post_id' => $post->ID,
			'status'  => 'approve',
			'orderby' => 'comment_date_gmt',
			'order'   => 'DESC',
			'number'  => 100,
		)
	);

	$comentarios = array_map( 'uneti_comentarios_formatear', $comments );

	return rest_ensure_response(
		array(
			'comentarios'      => $comentarios,
			'total'            => count( $comentarios ),
			'comentariosAbiertos' => comments_open( $post->ID ),
		)
	);
}

function uneti_comentarios_crear( WP_REST_Request $request ) {
	$post = uneti_comentarios_post( $request->get_param( 'slug' ) );

	if ( is_wp_error( $post ) ) {
		return $post;
	}

	if ( ! comments_open( $post->ID ) ) {
		return new WP_Error(
			'uneti_comentarios_cerrados',
			'Los comentarios están cerrados para esta noticia.',
			array( 'status' => 403 )
		);
	}

	$nombre    = sanitize_text_field( (string) $request->get_param( 'nombre' ) );
	$correo    = sanitize_email( (string) $request->get_param( 'correo' ) );
	$contenido = sanitize_textarea_field( (string) $request->get_param( 'contenido' ) );

	if ( mb_strlen( $nombre ) < 2 ) {
		return new WP_Error( 'uneti_nombre_invalido', 'Escribe tu nombre.', array( 'status' => 400 ) );
	}

	if ( mb_strlen( $contenido ) < 3 ) {
		return new WP_Error( 'uneti_contenido_corto', 'El comentario es demasiado corto.', array( 'status' => 400 ) );
	}

	if ( mb_strlen( $contenido ) > 2000 ) {
		return new WP_Error( 'uneti_contenido_largo', 'El comentario supera los 2000 caracteres.', array( 'status' => 400 ) );
	}

	if ( '' !== $correo && ! is_email( $correo ) ) {
		return new WP_Error( 'uneti_correo_invalido', 'El correo no es válido.', array( 'status' => 400 ) );
	}

	$comment_id = wp_insert_comment(
		array(
			'comment_post_ID'      => $post->ID,
			'comment_author'       => $nombre,
			'comment_author_email' => $correo,
			'comment_author_url'   => '',
			'comment_content'      => $contenido,
			'comment_type'         => 'comment',
			'comment_parent'       => 0,
			'comment_approved'     => 1,
			'comment_agent'        => sanitize_text_field( (string) ( $_SERVER['HTTP_USER_AGENT'] ?? '' ) ),
			'comment_author_IP'    => sanitize_text_field( (string) ( $_SERVER['REMOTE_ADDR'] ?? '' ) ),
		)
	);

	if ( ! $comment_id ) {
		return new WP_Error(
			'uneti_comentario_fallido',
			'No se pudo guardar el comentario.',
			array( 'status' => 500 )
		);
	}

	$comment = get_comment( $comment_id );
	$response = rest_ensure_response(
		array(
			'comentario' => uneti_comentarios_formatear( $comment ),
		)
	);
	$response->set_status( 201 );

	return $response;
}
