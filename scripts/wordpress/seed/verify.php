<?php
/**
 * Verifica que los fixtures estén importados correctamente en WordPress.
 *
 * Uso:
 *   php /opt/uneti-scripts/seed/verify.php --input=/tmp/uneti-seed-import
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

require_once '/var/www/html/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once __DIR__ . '/lib.php';

$input    = untrailingslashit( uneti_seed_arg( 'input', '/tmp/uneti-seed-import' ) );
$manifest = uneti_seed_read_json( $input . '/manifest.json' );
$site     = uneti_seed_read_json( $input . '/site.json' );
$media    = uneti_seed_read_json( $input . '/media.json' );
$files    = glob( $input . '/posts/*.json' );
$posts    = array();

foreach ( (array) $files as $file ) {
	$posts[] = uneti_seed_read_json( $file );
}

$errors = array();
$checks = array();
$uploads = wp_upload_dir();

if ( 1 !== (int) $manifest['schemaVersion'] ) {
	$errors[] = 'schemaVersion no soportada.';
}

if ( ! is_plugin_active( 'wp-graphql/wp-graphql.php' ) ) {
	$errors[] = 'WPGraphQL no está activo.';
}

if ( $site['title'] !== get_option( 'blogname' ) ) {
	$errors[] = 'blogname inesperado: ' . get_option( 'blogname' );
}

if ( $site['permalinkStructure'] !== get_option( 'permalink_structure' ) ) {
	$errors[] = 'permalink_structure inesperado: ' . get_option( 'permalink_structure' );
}

$published = get_posts(
	array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
		'fields'         => 'ids',
	)
);

$checks['publishedPosts'] = count( $published );
if ( count( $published ) !== (int) $manifest['counts']['posts'] ) {
	$errors[] = 'Posts publicados: ' . count( $published ) . '; esperados: ' . (int) $manifest['counts']['posts'];
}

foreach ( $posts as $post ) {
	$post_id = uneti_seed_find_post( $post['key'], $post['slug'] );
	if ( ! $post_id ) {
		$errors[] = 'Falta el post ' . $post['slug'];
		continue;
	}

	$stored = get_post( $post_id );
	if ( ! $stored || 'publish' !== $stored->post_status ) {
		$errors[] = 'El post ' . $post['slug'] . ' no está publicado.';
		continue;
	}

	if ( $stored->post_name !== $post['slug'] ) {
		$errors[] = 'Slug distinto en ' . $post['slug'] . ': ' . $stored->post_name;
	}

	if ( ! empty( $post['featuredMedia'] ) ) {
		$thumb_id = (int) get_post_thumbnail_id( $post_id );
		if ( ! $thumb_id ) {
			$errors[] = 'El post ' . $post['slug'] . ' no tiene imagen destacada.';
		} else {
			$attached = (string) get_post_meta( $thumb_id, '_wp_attached_file', true );
			if ( ! $attached || ! is_file( trailingslashit( $uploads['basedir'] ) . $attached ) ) {
				$errors[] = 'Archivo de imagen ausente para ' . $post['slug'] . ': ' . $attached;
			}
		}
	}
}

$comments = get_comments(
	array(
		'meta_key'     => '_uneti_seed_key',
		'meta_compare' => 'EXISTS',
		'status'       => 'all',
	)
);

$checks['comments'] = count( $comments );
if ( count( $comments ) !== (int) $manifest['counts']['comments'] ) {
	$errors[] = 'Comentarios: ' . count( $comments ) . '; esperados: ' . (int) $manifest['counts']['comments'];
}

$media_ok = 0;
foreach ( $media as $item ) {
	$attachment_id = uneti_seed_find_attachment( $item['key'], $item['file'] );
	if ( ! $attachment_id ) {
		$errors[] = 'Falta el adjunto ' . $item['key'];
		continue;
	}

	$attached = (string) get_post_meta( $attachment_id, '_wp_attached_file', true );
	$absolute = trailingslashit( $uploads['basedir'] ) . $attached;
	if ( $attached !== $item['file'] ) {
		$errors[] = 'Ruta distinta para ' . $item['key'] . ': ' . $attached;
	}
	if ( ! is_file( $absolute ) ) {
		$errors[] = 'Archivo ausente para ' . $item['key'] . ': ' . $absolute;
		continue;
	}

	$sha = uneti_seed_sha256( $absolute );
	if ( ! empty( $item['sha256'] ) && ! hash_equals( $item['sha256'], $sha ) ) {
		$errors[] = 'SHA-256 distinto para ' . $item['key'];
	}

	$url = wp_get_attachment_url( $attachment_id );
	if ( ! $url ) {
		$errors[] = 'URL ausente para ' . $item['key'];
	}
	$media_ok++;
}

$checks['media'] = $media_ok;
uneti_seed_emit(
	'UNETI_SEED_VERIFY',
	array(
		'ok'      => empty( $errors ),
		'checks'  => $checks,
		'errors'  => $errors,
		'homeUrl' => uneti_seed_site_url(),
	)
);

if ( ! empty( $errors ) ) {
	exit( 1 );
}
