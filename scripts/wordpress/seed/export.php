<?php
/**
 * Exporta las noticias publicadas a fixtures JSON portables.
 *
 * Uso:
 *   php /opt/uneti-scripts/seed/export.php --output=/tmp/uneti-seed-export
 *
 * Opcionales:
 *   --include-drafts   Incluye borradores.
 *   --force            Elimina el directorio de salida si ya existe.
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

require_once '/var/www/html/wp-load.php';
require_once __DIR__ . '/lib.php';

$output         = untrailingslashit( uneti_seed_arg( 'output', '/tmp/uneti-seed-export' ) );
$include_drafts = uneti_seed_flag( 'include-drafts' );

if ( is_dir( $output ) ) {
	if ( ! uneti_seed_flag( 'force' ) ) {
		uneti_seed_fail( 'El directorio de salida ya existe: ' . $output . '. Usa --force para reemplazarlo.' );
	}
	uneti_seed_remove_dir( $output );
}

if ( ! wp_mkdir_p( $output ) ) {
	uneti_seed_fail( 'No se pudo crear ' . $output );
}

$statuses = $include_drafts ? array( 'publish', 'draft' ) : array( 'publish' );
$posts    = get_posts(
	array(
		'post_type'      => 'post',
		'post_status'    => $statuses,
		'posts_per_page' => -1,
		'orderby'        => 'date',
		'order'          => 'DESC',
	)
);

if ( ! $posts ) {
	uneti_seed_fail( 'No hay noticias para exportar.' );
}

$uploads        = wp_upload_dir();
$media_items    = array();
$media_urls     = array();
$media_ids      = array();
$taxonomies     = array( 'categories' => array(), 'tags' => array() );
$posts_raw      = array();
$comments_total = 0;

foreach ( $posts as $post ) {
	$thumb_id   = (int) get_post_thumbnail_id( $post->ID );
	$media_key  = null;
	$attachment = $thumb_id ? get_post( $thumb_id ) : null;
	$attached   = $thumb_id ? (string) get_post_meta( $thumb_id, '_wp_attached_file', true ) : '';
	$file       = ltrim( str_replace( '\\', '/', $attached ), '/' );

	if ( $thumb_id && $attachment && $file ) {
		$base_key  = uneti_seed_media_key( $file );
		$media_key = $base_key;
		$suffix    = 2;
		while ( isset( $media_items[ $media_key ] ) && (int) $media_items[ $media_key ]['_attachment_id'] !== $thumb_id ) {
			$media_key = $base_key . '-' . $suffix;
			$suffix++;
		}

		if ( ! isset( $media_items[ $media_key ] ) ) {
			$source = trailingslashit( $uploads['basedir'] ) . $file;
			if ( ! is_file( $source ) ) {
				uneti_seed_fail( 'Falta el original del adjunto ' . $thumb_id . ': ' . $source );
			}

			$destination = trailingslashit( $output ) . 'media/' . $file;
			if ( ! wp_mkdir_p( dirname( $destination ) ) || ! copy( $source, $destination ) ) {
				uneti_seed_fail( 'No se pudo copiar ' . $source . ' a ' . $destination );
			}

			$metadata = wp_get_attachment_metadata( $thumb_id );
			$url      = wp_get_attachment_url( $thumb_id );
			if ( ! $url ) {
				$url = trailingslashit( $uploads['baseurl'] ) . $file;
			}

			$media_items[ $media_key ] = array(
				'key'            => $media_key,
				'file'           => $file,
				'mime'           => $attachment->post_mime_type,
				'title'          => $attachment->post_title,
				'alt'            => (string) get_post_meta( $thumb_id, '_wp_attachment_image_alt', true ),
				'caption'        => $attachment->post_excerpt,
				'description'    => $attachment->post_content,
				'date'           => $attachment->post_date,
				'dateGmt'        => $attachment->post_date_gmt,
				'width'          => isset( $metadata['width'] ) ? (int) $metadata['width'] : 0,
				'height'         => isset( $metadata['height'] ) ? (int) $metadata['height'] : 0,
				'sha256'         => uneti_seed_sha256( $source ),
				'bytes'          => (int) filesize( $source ),
				'credit'         => (string) get_post_meta( $thumb_id, '_uneti_seed_credit', true ),
				'_attachment_id' => $thumb_id,
			);

			$media_urls[ $media_key ] = $url;
			$media_ids[ $media_key ]  = $thumb_id;
		}
	}

	$categories = wp_get_post_categories( $post->ID, array( 'fields' => 'all' ) );
	foreach ( $categories as $term ) {
		$taxonomies['categories'][ $term->slug ] = array(
			'slug'        => $term->slug,
			'name'        => $term->name,
			'description' => $term->description,
			'parent'      => $term->parent ? uneti_seed_term_slug( $term->parent, 'category' ) : '',
		);
	}

	$tags = wp_get_post_tags( $post->ID, array( 'fields' => 'all' ) );
	foreach ( $tags as $term ) {
		$taxonomies['tags'][ $term->slug ] = array(
			'slug'        => $term->slug,
			'name'        => $term->name,
			'description' => $term->description,
			'parent'      => '',
		);
	}

	$comments     = get_comments(
		array(
			'post_id' => $post->ID,
			'status'  => 'approve',
			'type'    => 'comment',
			'orderby' => 'comment_date_gmt',
			'order'   => 'ASC',
		)
	);
	$comment_keys = array();
	foreach ( $comments as $comment ) {
		$comment_keys[ (int) $comment->comment_ID ] = uneti_seed_comment_key( $post->post_name, $comment );
	}

	$comments_out = array();
	foreach ( $comments as $comment ) {
		$parent_key = null;
		if ( $comment->comment_parent && isset( $comment_keys[ (int) $comment->comment_parent ] ) ) {
			$parent_key = $comment_keys[ (int) $comment->comment_parent ];
		}

		$comments_out[] = array(
			'key'      => $comment_keys[ (int) $comment->comment_ID ],
			'author'   => $comment->comment_author,
			'email'    => uneti_seed_public_email( $comment->comment_author_email ),
			'content'  => $comment->comment_content,
			'date'     => $comment->comment_date,
			'dateGmt'  => $comment->comment_date_gmt,
			'approved' => (int) $comment->comment_approved,
			'parent'   => $parent_key,
		);
	}
	$comments_total += count( $comments_out );

	$posts_raw[] = array(
		'key'           => $post->post_name,
		'slug'          => $post->post_name,
		'title'         => $post->post_title,
		'excerpt'       => $post->post_excerpt,
		'content'       => $post->post_content,
		'status'        => $post->post_status,
		'date'          => $post->post_date,
		'dateGmt'       => $post->post_date_gmt,
		'commentStatus' => $post->comment_status,
		'categories'    => wp_list_pluck( $categories, 'slug' ),
		'tags'          => wp_list_pluck( $tags, 'slug' ),
		'featuredMedia' => $media_key,
		'comments'      => $comments_out,
	);
}

$output_posts = array();
foreach ( $posts_raw as $post ) {
	$post['content'] = uneti_seed_normalize_content( $post['content'], $media_urls, $media_ids );
	$output_posts[]  = $post;

	uneti_seed_write_json(
		trailingslashit( $output ) . 'posts/' . $post['slug'] . '.json',
		$post
	);
}

ksort( $media_items );
$media_out = array();
foreach ( $media_items as $item ) {
	unset( $item['_attachment_id'] );
	$media_out[] = $item;
}

ksort( $taxonomies['categories'] );
ksort( $taxonomies['tags'] );

$default_category = get_term( (int) get_option( 'default_category' ), 'category' );
$site             = array(
	'title'                => get_option( 'blogname' ),
	'description'          => get_option( 'blogdescription' ),
	'locale'               => get_option( 'WPLANG' ),
	'timezone'             => get_option( 'timezone_string' ),
	'gmtOffset'            => (float) get_option( 'gmt_offset' ),
	'dateFormat'           => get_option( 'date_format' ),
	'timeFormat'           => get_option( 'time_format' ),
	'startOfWeek'          => (int) get_option( 'start_of_week' ),
	'postsPerPage'         => (int) get_option( 'posts_per_page' ),
	'permalinkStructure'   => get_option( 'permalink_structure' ),
	'defaultCommentStatus' => get_option( 'default_comment_status' ),
	'threadComments'       => (int) get_option( 'thread_comments' ),
	'threadCommentsDepth'  => (int) get_option( 'thread_comments_depth' ),
	'requireNameEmail'     => (int) get_option( 'require_name_email' ),
	'showAvatars'          => (int) get_option( 'show_avatars' ),
	'commentModeration'    => (int) get_option( 'comment_moderation' ),
	'commentRegistration'  => (int) get_option( 'comment_registration' ),
	'defaultCategory'      => array(
		'slug' => ( $default_category && ! is_wp_error( $default_category ) ) ? $default_category->slug : 'sin-categoria',
		'name' => ( $default_category && ! is_wp_error( $default_category ) ) ? $default_category->name : 'Sin categoría',
	),
	'author'               => array(
		'key'         => 'redaccion',
		'login'       => 'redaccion',
		'displayName' => 'Redacción UNETI',
		'email'       => 'redaccion@example.com',
		'description' => 'Equipo de Comunicaciones de la Universidad Nacional Experimental de las Telecomunicaciones e Informática.',
		'role'        => 'author',
	),
);

uneti_seed_write_json( trailingslashit( $output ) . 'site.json', $site );
uneti_seed_write_json(
	trailingslashit( $output ) . 'taxonomies.json',
	array(
		'categories' => array_values( $taxonomies['categories'] ),
		'tags'       => array_values( $taxonomies['tags'] ),
	)
);
uneti_seed_write_json( trailingslashit( $output ) . 'media.json', $media_out );
uneti_seed_write_json(
	trailingslashit( $output ) . 'manifest.json',
	array(
		'schemaVersion'    => 1,
		'generator'        => 'uneti-seed-export',
		'wordpressVersion' => get_bloginfo( 'version' ),
		'counts'           => array(
			'posts'      => count( $output_posts ),
			'media'      => count( $media_out ),
			'comments'   => $comments_total,
			'categories' => count( $taxonomies['categories'] ),
			'tags'       => count( $taxonomies['tags'] ),
		),
	)
);

uneti_seed_log(
	sprintf(
		'Exportadas %d noticias, %d imágenes y %d comentarios en %s',
		count( $output_posts ),
		count( $media_out ),
		$comments_total,
		$output
	)
);
uneti_seed_result(
	array(
		'ok'       => true,
		'output'   => $output,
		'posts'    => count( $output_posts ),
		'media'    => count( $media_out ),
		'comments' => $comments_total,
	)
);
