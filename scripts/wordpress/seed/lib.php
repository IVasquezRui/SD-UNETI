<?php
/**
 * Utilidades compartidas por export.php, importar.php y verify.php.
 *
 * Este archivo se carga después de wp-load.php: puede usar funciones de
 * WordPress, pero no debe ejecutar escrituras por sí mismo.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit( 1 );
}

function uneti_seed_fail( $message ) {
	fwrite( STDERR, 'ERROR: ' . $message . "\n" );
	exit( 1 );
}

function uneti_seed_log( $message ) {
	fwrite( STDOUT, $message . "\n" );
}

function uneti_seed_arg( $name, $default = null ) {
	global $argv;

	$prefix = '--' . $name . '=';
	foreach ( (array) $argv as $argument ) {
		if ( 0 === strpos( $argument, $prefix ) ) {
			return substr( $argument, strlen( $prefix ) );
		}
	}

	$index = array_search( '--' . $name, (array) $argv, true );
	if ( false !== $index && isset( $argv[ $index + 1 ] ) && 0 !== strpos( $argv[ $index + 1 ], '--' ) ) {
		return $argv[ $index + 1 ];
	}

	return $default;
}

function uneti_seed_flag( $name ) {
	global $argv;

	return in_array( '--' . $name, (array) $argv, true );
}

function uneti_seed_write_json( $path, $data ) {
	$directory = dirname( $path );
	if ( ! wp_mkdir_p( $directory ) ) {
		uneti_seed_fail( 'No se pudo crear el directorio ' . $directory );
	}

	$json = wp_json_encode( $data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	if ( false === $json ) {
		uneti_seed_fail( 'No se pudo serializar ' . $path );
	}

	$temporary = $path . '.tmp';
	if ( false === file_put_contents( $temporary, $json . "\n" ) ) {
		uneti_seed_fail( 'No se pudo escribir ' . $temporary );
	}

	if ( ! rename( $temporary, $path ) ) {
		@unlink( $temporary );
		uneti_seed_fail( 'No se pudo mover ' . $temporary . ' a ' . $path );
	}
}

function uneti_seed_read_json( $path ) {
	if ( ! is_file( $path ) ) {
		uneti_seed_fail( 'No existe el archivo ' . $path );
	}

	$raw = file_get_contents( $path );
	if ( false === $raw ) {
		uneti_seed_fail( 'No se pudo leer ' . $path );
	}

	$data = json_decode( $raw, true );
	if ( JSON_ERROR_NONE !== json_last_error() ) {
		uneti_seed_fail( 'JSON inválido en ' . $path . ': ' . json_last_error_msg() );
	}

	return $data;
}

function uneti_seed_remove_dir( $directory ) {
	if ( ! is_dir( $directory ) ) {
		return;
	}

	$iterator = new RecursiveIteratorIterator(
		new RecursiveDirectoryIterator( $directory, FilesystemIterator::SKIP_DOTS ),
		RecursiveIteratorIterator::CHILD_FIRST
	);

	foreach ( $iterator as $item ) {
		if ( $item->isDir() ) {
			@rmdir( $item->getPathname() );
		} else {
			@unlink( $item->getPathname() );
		}
	}

	@rmdir( $directory );
}

function uneti_seed_site_url() {
	return untrailingslashit( home_url() );
}

function uneti_seed_media_key( $file ) {
	$base = pathinfo( (string) $file, PATHINFO_FILENAME );
	$key  = sanitize_title( $base );

	return $key ? $key : 'media';
}

function uneti_seed_sha256( $file ) {
	$hash = hash_file( 'sha256', $file );

	return false === $hash ? '' : $hash;
}

/**
 * Solo se publican correos de ejemplo. Cualquier correo real se omite del
 * fixture para no versionar datos personales.
 */
function uneti_seed_public_email( $email ) {
	$email = (string) $email;

	return preg_match( '/@example\.(com|org|net)$/i', $email ) ? $email : '';
}

function uneti_seed_normalize_content( $content, $media_urls, $media_ids ) {
	$content = (string) $content;

	foreach ( $media_urls as $key => $url ) {
		if ( $url ) {
			$content = str_replace( $url, '{{MEDIA_URL:' . $key . '}}', $content );
		}
	}

	foreach ( $media_ids as $key => $id ) {
		$pattern = '/wp-image-' . preg_quote( (string) $id, '/' ) . '\b/';
		$content = preg_replace( $pattern, 'wp-image-{{MEDIA_ID:' . $key . '}}', $content );
	}

	$uploads = wp_upload_dir();
	if ( ! empty( $uploads['baseurl'] ) ) {
		$content = str_replace( trailingslashit( $uploads['baseurl'] ), '{{UPLOADS_URL}}/', $content );
	}

	return str_replace( uneti_seed_site_url(), '{{SITE_URL}}', $content );
}

function uneti_seed_resolve_content( $content, $media_urls, $media_ids ) {
	$content = (string) $content;

	foreach ( $media_urls as $key => $url ) {
		$content = str_replace( '{{MEDIA_URL:' . $key . '}}', $url, $content );
	}

	foreach ( $media_ids as $key => $id ) {
		$content = str_replace( '{{MEDIA_ID:' . $key . '}}', (string) $id, $content );
	}

	$uploads = wp_upload_dir();
	if ( ! empty( $uploads['baseurl'] ) ) {
		$content = str_replace( '{{UPLOADS_URL}}/', trailingslashit( $uploads['baseurl'] ), $content );
	}

	return str_replace( '{{SITE_URL}}', uneti_seed_site_url(), $content );
}

function uneti_seed_find_post( $key, $slug ) {
	$ids = get_posts(
		array(
			'post_type'      => 'post',
			'post_status'    => 'any',
			'posts_per_page' => 1,
			'fields'         => 'ids',
			'meta_key'       => '_uneti_seed_key',
			'meta_value'     => $key,
		)
	);

	if ( ! $ids && $slug ) {
		$page = get_page_by_path( $slug, OBJECT, 'post' );
		if ( $page ) {
			$ids = array( $page->ID );
		}
	}

	return $ids ? (int) $ids[0] : 0;
}

function uneti_seed_find_attachment( $key, $file ) {
	$queries = array(
		array( '_uneti_seed_key', $key ),
		array( '_uneti_seed_archivo', basename( (string) $file ) ),
		array( '_wp_attached_file', (string) $file ),
	);

	foreach ( $queries as $query ) {
		if ( '' === (string) $query[1] ) {
			continue;
		}

		$ids = get_posts(
			array(
				'post_type'      => 'attachment',
				'post_status'    => 'inherit',
				'posts_per_page' => 1,
				'fields'         => 'ids',
				'meta_key'       => $query[0],
				'meta_value'     => $query[1],
			)
		);

		if ( $ids ) {
			return (int) $ids[0];
		}
	}

	return 0;
}

function uneti_seed_term_slug( $term_id, $taxonomy ) {
	$term = get_term( (int) $term_id, $taxonomy );

	return ( $term && ! is_wp_error( $term ) ) ? $term->slug : '';
}

function uneti_seed_comment_key( $post_key, $comment ) {
	$seed = implode(
		'|',
		array(
			$post_key,
			$comment->comment_author,
			$comment->comment_date_gmt,
			$comment->comment_content,
		)
	);

	return $post_key . '-comment-' . substr( md5( $seed ), 0, 16 );
}

function uneti_seed_find_comment( $key, $post_id, $author, $content ) {
	$comments = get_comments(
		array(
			'meta_key'   => '_uneti_seed_key',
			'meta_value' => $key,
			'number'     => 1,
			'status'     => 'all',
		)
	);

	if ( $comments ) {
		return (int) $comments[0]->comment_ID;
	}

	$comments = get_comments(
		array(
			'post_id' => $post_id,
			'author'  => $author,
			'number'  => 50,
			'status'  => 'all',
		)
	);

	foreach ( $comments as $comment ) {
		if ( trim( $comment->comment_content ) === trim( $content ) ) {
			return (int) $comment->comment_ID;
		}
	}

	return 0;
}

function uneti_seed_emit( $marker, $result ) {
	fwrite( STDOUT, $marker . ' ' . wp_json_encode( $result, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE ) . "\n" );
}

function uneti_seed_result( $result ) {
	uneti_seed_emit( 'UNETI_SEED_RESULT', $result );
}
