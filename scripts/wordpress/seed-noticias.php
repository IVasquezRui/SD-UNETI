<?php
/**
 * Siembra idempotente de noticias y comentarios de demostración.
 * Ejecutar dentro del contenedor:
 *   docker exec -i wp_site php < scripts/wordpress/seed-noticias.php
 */

require_once '/var/www/html/wp-load.php';

function uneti_categoria_id( $nombre ) {
	$termino = term_exists( $nombre, 'category' );
	if ( ! $termino ) {
		$termino = wp_insert_term( $nombre, 'category' );
	}
	if ( is_wp_error( $termino ) ) {
		return 0;
	}
	return (int) ( is_array( $termino ) ? $termino['term_id'] : $termino );
}

function uneti_adjuntar_imagen( $post_id, $archivo ) {
	$uploads = wp_upload_dir();
	$ruta    = trailingslashit( $uploads['basedir'] ) . '2026/10/' . $archivo;

	if ( ! file_exists( $ruta ) ) {
		return;
	}

	$existentes = get_posts(
		array(
			'post_type'      => 'attachment',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_uneti_seed_archivo',
			'meta_value'     => $archivo,
		)
	);

	if ( $existentes ) {
		set_post_thumbnail( $post_id, (int) $existentes[0] );
		return;
	}

	$tipo    = wp_check_filetype( $archivo );
	$adjunto = wp_insert_attachment(
		array(
			'post_mime_type' => $tipo['type'],
			'post_title'     => sanitize_file_name( $archivo ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		),
		$ruta,
		$post_id
	);

	if ( is_wp_error( $adjunto ) || ! $adjunto ) {
		return;
	}

	require_once ABSPATH . 'wp-admin/includes/image.php';
	$metadata = wp_generate_attachment_metadata( $adjunto, $ruta );
	wp_update_attachment_metadata( $adjunto, $metadata );
	update_post_meta( $adjunto, '_uneti_seed_archivo', $archivo );
	update_post_meta( $adjunto, '_wp_attachment_image_alt', 'Noticia institucional de la UNETI' );
	set_post_thumbnail( $post_id, $adjunto );
}

function uneti_guardar_noticia( $datos ) {
	$existente = get_page_by_path( $datos['slug'], OBJECT, 'post' );
	$categoria = uneti_categoria_id( $datos['categoria'] );
	$args      = array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'post_title'     => $datos['titulo'],
		'post_name'      => $datos['slug'],
		'post_excerpt'   => $datos['resumen'],
		'post_content'   => $datos['contenido'],
		'post_date'      => $datos['fecha'],
		'post_author'    => 1,
		'comment_status' => 'open',
		'ping_status'    => 'closed',
	);

	if ( $existente ) {
		$args['ID'] = $existente->ID;
		$post_id    = wp_update_post( $args, true );
	} else {
		$post_id = wp_insert_post( $args, true );
	}

	if ( is_wp_error( $post_id ) || ! $post_id ) {
		echo "ERROR: {$datos['slug']}\n";
		return 0;
	}

	if ( $categoria ) {
		wp_set_post_categories( $post_id, array( $categoria ) );
	}
	wp_set_post_tags( $post_id, $datos['etiquetas'], false );
	uneti_adjuntar_imagen( $post_id, $datos['imagen'] );

	echo "OK: {$datos['slug']} (ID {$post_id})\n";
	return $post_id;
}

$noticias = array();

$noticias[] = array(
	'slug'      => 'uneti-abre-convocatoria-admision-2026',
	'titulo'    => 'UNETI abre la convocatoria de admisión 2026',
	'resumen'   => 'El proceso de ingreso a los PNF en Informática y Telecomunicaciones inicia con el registro en el Sistema Nacional de Ingreso y acompañamiento académico.',
	'categoria' => 'Admisión',
	'etiquetas' => array( 'Admisión', 'PNF', 'Ingreso' ),
	'fecha'     => '2026-10-17 09:00:00',
	'imagen'    => 'admisiones-2026.jpg',
	'contenido' => '<p>La Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI) abrió la convocatoria de admisión para el año académico 2026. La oferta incluye los Programas Nacionales de Formación en Informática y en Telecomunicaciones, ambos con salidas progresivas como Técnico Medio, TSU e Ingeniero.</p><h2>Requisitos y pasos</h2><p>Las personas aspirantes deben registrarse en el Sistema Nacional de Ingreso, consignar el título de bachiller, las notas certificadas, la cédula de identidad y una fotografía reciente. El equipo de admisiones acompaña cada etapa con orientación académica y vocacional.</p><ul><li>Registro en el Sistema Nacional de Ingreso.</li><li>Consignación de documentos en formato digital.</li><li>Orientación sobre modalidad, prácticas y salidas profesionales.</li><li>Confirmación de ingreso y acceso al campus virtual.</li></ul><p>La UNETI mantiene su compromiso con una educación gratuita, multimodal y centrada en el aprender haciendo, con proyectos que responden a las necesidades del país.</p>',
);

$noticias[] = array(
	'slug'      => 'estudiantes-informatica-plataforma-proyectos-comunitarios',
	'titulo'    => 'Estudiantes de Informática crean plataforma para gestionar proyectos comunitarios',
	'resumen'   => 'El proyecto sociotecnológico permite registrar, priorizar y hacer seguimiento a iniciativas de organizaciones comunitarias de Caracas.',
	'categoria' => 'Innovación',
	'etiquetas' => array( 'Informática', 'Proyecto sociotecnológico', 'Comunidad' ),
	'fecha'     => '2026-10-16 15:30:00',
	'imagen'    => 'innovacion-comunitaria.jpg',
	'contenido' => '<p>Un equipo de estudiantes del PNF en Informática presentó una plataforma web para registrar y hacer seguimiento a los proyectos de organizaciones comunitarias. La solución fue desarrollada como parte del proyecto sociotecnológico del trayecto III y ya se encuentra en fase piloto.</p><p>La aplicación permite crear fichas de proyecto, asignar responsables, registrar avances y generar reportes sencillos para las asambleas comunitarias. El equipo trabajó con metodologías ágiles y realizó talleres de levantamiento de requerimientos en territorio.</p><h2>Tecnología con pertinencia social</h2><p>El desarrollo utiliza software libre, una base de datos relacional y una interfaz adaptable a teléfonos móviles. Docentes del programa destacaron que el valor del proyecto está en haber partido de una necesidad real y en haberla traducido en una solución sostenible.</p><p>La siguiente etapa incluye capacitación a las organizaciones y la incorporación de nuevos módulos para la gestión de inventarios y actividades formativas.</p>',
);


$noticias[] = array(
	'slug'      => 'laboratorio-telecomunicaciones-equipos-fibra-optica',
	'titulo'    => 'Laboratorio de Telecomunicaciones estrena equipos para prácticas de fibra óptica',
	'resumen'   => 'La dotación incluye fusionadoras, medidores de potencia y analizadores que fortalecen la formación práctica de los estudiantes.',
	'categoria' => 'Académico',
	'etiquetas' => array( 'Telecomunicaciones', 'Laboratorio', 'Fibra óptica' ),
	'fecha'     => '2026-10-15 11:15:00',
	'imagen'    => 'laboratorio-telecom.jpg',
	'contenido' => '<p>El Laboratorio de Telecomunicaciones de la UNETI incorporó nuevos equipos para las prácticas de fibra óptica. La dotación incluye fusionadoras, medidores de potencia óptica, fuentes de luz y analizadores de espectro para las asignaturas de transmisión y redes de acceso.</p><p>Los estudiantes podrán realizar empalmes, mediciones de atenuación, certificación de enlaces y diagnóstico de fallas en condiciones similares a las de una red real. La práctica se integra con los proyectos sociotecnológicos de conectividad comunitaria.</p><h2>Formación con infraestructura real</h2><p>El laboratorio también será utilizado en talleres abiertos para docentes y técnicos de instituciones aliadas. La UNETI ratifica así su compromiso con una formación técnica pertinente y con la soberanía tecnológica del país.</p>',
);

$noticias[] = array(
	'slug'      => 'uneti-feria-nacional-ciencia-tecnologia',
	'titulo'    => 'UNETI presente en la Feria Nacional de Ciencia y Tecnología',
	'resumen'   => 'Docentes y estudiantes presentaron prototipos de conectividad rural, monitoreo ambiental y accesibilidad digital.',
	'categoria' => 'Investigación',
	'etiquetas' => array( 'Investigación', 'Ciencia', 'Tecnología' ),
	'fecha'     => '2026-10-14 10:00:00',
	'imagen'    => 'feria-ciencia.jpg',
	'contenido' => '<p>La UNETI participó en la Feria Nacional de Ciencia y Tecnología con una muestra de prototipos desarrollados por estudiantes y docentes de ambos Programas Nacionales de Formación. La delegación presentó soluciones de conectividad para zonas rurales, sensores de monitoreo ambiental y herramientas de accesibilidad digital.</p><p>Los visitantes pudieron interactuar con una red comunitaria de bajo consumo, un sistema de alerta temprana para emergencias y una aplicación de lectura accesible para personas con discapacidad visual.</p><h2>Investigación que resuelve problemas</h2><p>La participación permitió establecer alianzas con instituciones públicas, empresas del sector tecnológico y otras universidades. Los proyectos seleccionados recibirán acompañamiento para su consolidación y transferencia a las comunidades.</p>',
);


$noticias[] = array(
	'slug'      => 'culmina-cohorte-diplomado-ciberseguridad',
	'titulo'    => 'Culmina la primera cohorte del diplomado en ciberseguridad',
	'resumen'   => 'Participantes de instituciones públicas y comunidades organizadas completaron la formación en protección de infraestructuras críticas.',
	'categoria' => 'Formación',
	'etiquetas' => array( 'Ciberseguridad', 'Formación', 'Diplomado' ),
	'fecha'     => '2026-10-10 16:00:00',
	'imagen'    => 'ciberseguridad.jpg',
	'contenido' => '<p>La primera cohorte del diplomado en ciberseguridad de la UNETI culminó sus actividades con la presentación de proyectos finales orientados a la protección de infraestructuras críticas y datos personales. La formación reunió a profesionales de instituciones públicas, cooperativas y organizaciones comunitarias.</p><p>El programa combinó fundamentos de seguridad, gestión de riesgos, respuesta a incidentes y buenas prácticas de configuración de sistemas. Las y los participantes trabajaron en laboratorios aislados y desarrollaron planes de contingencia para sus organizaciones.</p><h2>Una red de protección colectiva</h2><p>La UNETI prevé abrir una segunda cohorte en el primer trimestre de 2027, con módulos avanzados en seguridad de redes y análisis forense. Las personas interesadas podrán postularse a través del portal institucional.</p>',
);

$noticias[] = array(
	'slug'      => 'agenda-uneti-formacion-docente-podcast-deportes',
	'titulo'    => 'Agenda UNETI: formación docente, podcast y actividades deportivas',
	'resumen'   => 'La comunidad unetista tendrá una semana de actividades académicas, culturales y deportivas en todos los nodos.',
	'categoria' => 'Vida universitaria',
	'etiquetas' => array( 'Vida universitaria', 'Formación docente', 'Podcast' ),
	'fecha'     => '2026-10-08 08:30:00',
	'imagen'    => 'agenda-universitaria.jpg',
	'contenido' => '<p>La Dirección de Extensión de la UNETI publicó la agenda de actividades para la próxima semana. La programación incluye los Miércoles de Formación, el Podcast Universitario, talleres de tecnología educativa y encuentros deportivos entre los nodos.</p><ul><li>Miércoles de Formación: inteligencia artificial aplicada a la docencia.</li><li>Podcast Universitario: voces de estudiantes y egresados.</li><li>Taller de plataformas virtuales para docentes.</li><li>Torneo de fútbol y baloncesto entre nodos.</li></ul><p>Las actividades son gratuitas y abiertas a la comunidad universitaria. Las inscripciones se realizan a través del campus virtual y de las coordinaciones académicas de cada nodo.</p>',
);

foreach ( $noticias as $noticia ) {
	uneti_guardar_noticia( $noticia );
}

$primera = get_page_by_path( 'uneti-abre-convocatoria-admision-2026', OBJECT, 'post' );

if ( $primera ) {
	$modelo = array(
		array(
			'nombre'   => 'María Fernanda Rojas',
			'correo'   => 'maria.rojas@example.com',
			'contenido' => 'Excelente noticia. ¿La convocatoria aplica también para quienes ya culminaron el bachillerato en años anteriores?',
		),
		array(
			'nombre'   => 'José Manuel Pérez',
			'correo'   => 'jose.perez@example.com',
			'contenido' => 'Gracias por mantener informada a la comunidad. La modalidad multimodal es una gran oportunidad para quienes trabajamos.',
		),
		array(
			'nombre'   => 'Ana Lucía Torres',
			'correo'   => 'ana.torres@example.com',
			'contenido' => 'Felicitaciones al equipo de admisiones por la orientación recibida en el proceso.',
		),
	);

	foreach ( $modelo as $indice => $comentario ) {
		$existentes = get_comments(
			array(
				'post_id' => $primera->ID,
				'author'  => $comentario['nombre'],
				'number'  => 20,
			)
		);
		$ya_existe = false;

		foreach ( $existentes as $existente ) {
			if ( trim( $existente->comment_content ) === $comentario['contenido'] ) {
				$ya_existe = true;
				break;
			}
		}

		if ( $ya_existe ) {
			continue;
		}

		$fecha = gmdate( 'Y-m-d H:i:s', time() - ( ( $indice + 1 ) * 3600 ) );
		wp_insert_comment(
			array(
				'comment_post_ID'      => $primera->ID,
				'comment_author'       => $comentario['nombre'],
				'comment_author_email' => $comentario['correo'],
				'comment_content'      => $comentario['contenido'],
				'comment_approved'     => 1,
				'comment_type'         => 'comment',
				'comment_date'         => get_date_from_gmt( $fecha ),
				'comment_date_gmt'     => $fecha,
			)
		);
	}
}

echo "Siembra completada.\n";
