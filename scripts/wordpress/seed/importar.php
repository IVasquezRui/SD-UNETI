<?php
/**
 * Importa los fixtures de seed/ usando las APIs nativas de WordPress.
 *
 * Uso:
 *   php /opt/uneti-scripts/seed/importar.php --input=/tmp/uneti-seed-import
 *
 * Opcionales:
 *   --dry-run        Valida sin escribir.
 *   --prune          Elimina objetos marcados por el seed que ya no están en los fixtures.
 *   --refresh-media  Sobrescribe originales y regenera metadatos.
 *   --skip-existing  No actualiza posts que ya existen.
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

require_once '/var/www/html/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once __DIR__ . '/lib.php';

$input          = untrailingslashit( uneti_seed_arg( 'input', '/tmp/uneti-seed-import' ) );
$dry_run        = uneti_seed_flag( 'dry-run' );
$prune          = uneti_seed_flag( 'prune' );
$refresh_media  = uneti_seed_flag( 'refresh-media' );
$skip_existing  = uneti_seed_flag( 'skip-existing' );

$site       = uneti_seed_read_json( $input . '/site.json' );
$taxonomies = uneti_seed_read_json( $input . '/taxonomies.json' );
$media      = uneti_seed_read_json( $input . '/media.json' );
$manifest   = uneti_seed_read_json( $input . '/manifest.json' );
$post_files = glob( $input . '/posts/*.json' );

if ( ! is_array( $post_files ) || ! $post_files ) {
	uneti_seed_fail( 'No hay archivos en ' . $input . '/posts/' );
}

$post_files = array_values( array_filter( $post_files, 'is_file' ) );
sort( $post_files );

$posts = array();
foreach ( $post_files as $file ) {
	$posts[] = uneti_seed_read_json( $file );
}

if ( 1 !== (int) $manifest['schemaVersion'] ) {
	uneti_seed_fail( 'schemaVersion no soportada: ' . $manifest['schemaVersion'] );
}

$media_by_key = array();
foreach ( $media as $item ) {
	if ( empty( $item['key'] ) || empty( $item['file'] ) ) {
		uneti_seed_fail( 'media.json contiene un elemento sin key o file.' );
	}
	if ( isset( $media_by_key[ $item['key'] ] ) ) {
		uneti_seed_fail( 'Clave de media duplicada: ' . $item['key'] );
	}
	$media_by_key[ $item['key'] ] = $item;
}

uneti_seed_log(
	sprintf(
		'Fixtures: %d posts, %d media, %d comentarios esperados.',
		count( $posts ),
		count( $media ),
		(int) $manifest['counts']['comments']
	)
);

if ( $dry_run ) {
	uneti_seed_log( 'Dry run: fixtures válidos. No se escribió nada.' );
	uneti_seed_result(
		array(
			'ok'       => true,
			'dryRun'   => true,
			'posts'    => count( $posts ),
			'media'    => count( $media ),
			'comments' => (int) $manifest['counts']['comments'],
		)
	);
	exit( 0 );
}

$author_data = $site['author'];
$author      = get_user_by( 'login', $author_data['login'] );
if ( ! $author && ! empty( $author_data['email'] ) ) {
	$author = get_user_by( 'email', $author_data['email'] );
}

if ( ! $author ) {
	$author_id = wp_insert_user(
		array(
			'user_login'   => $author_data['login'],
			'user_pass'    => wp_generate_password( 32, true, true ),
			'user_email'   => $author_data['email'],
			'display_name' => $author_data['displayName'],
			'description'  => $author_data['description'],
			'role'         => $author_data['role'],
		)
	);
	if ( is_wp_error( $author_id ) ) {
		uneti_seed_fail( 'No se pudo crear el autor: ' . $author_id->get_error_message() );
	}
	uneti_seed_log( 'Autor creado: ' . $author_data['login'] . ' (ID ' . $author_id . ')' );
} else {
	$author_id = (int) $author->ID;
	wp_update_user(
		array(
			'ID'           => $author_id,
			'display_name' => $author_data['displayName'],
			'description'  => $author_data['description'],
		)
	);
	uneti_seed_log( 'Autor existente: ' . $author_data['login'] . ' (ID ' . $author_id . ')' );
}

wp_set_current_user( $author_id );

function uneti_seed_import_term( $item, $taxonomy, $parent_id = 0 ) {
	$existing = term_exists( $item['slug'], $taxonomy );
	if ( ! $existing && ! empty( $item['name'] ) ) {
		$existing = term_exists( $item['name'], $taxonomy );
	}

	if ( $existing ) {
		$term_id = (int) ( is_array( $existing ) ? $existing['term_id'] : $existing );
		$updated = wp_update_term(
			$term_id,
			$taxonomy,
			array(
				'name'        => $item['name'],
				'slug'        => $item['slug'],
				'description' => isset( $item['description'] ) ? $item['description'] : '',
				'parent'      => $parent_id,
			)
		);
		if ( is_wp_error( $updated ) ) {
			uneti_seed_fail( 'No se pudo actualizar el término ' . $item['slug'] . ': ' . $updated->get_error_message() );
		}
		return $term_id;
	}

	$created = wp_insert_term(
		$item['name'],
		$taxonomy,
		array(
			'slug'        => $item['slug'],
			'description' => isset( $item['description'] ) ? $item['description'] : '',
			'parent'      => $parent_id,
		)
	);
	if ( is_wp_error( $created ) ) {
		uneti_seed_fail( 'No se pudo crear el término ' . $item['slug'] . ': ' . $created->get_error_message() );
	}

	return (int) $created['term_id'];
}

$term_ids = array( 'category' => array(), 'post_tag' => array() );

foreach ( array( 'category' => 'categories', 'post_tag' => 'tags' ) as $taxonomy => $source_key ) {
	$items = isset( $taxonomies[ $source_key ] ) ? $taxonomies[ $source_key ] : array();

	foreach ( $items as $item ) {
		if ( empty( $item['parent'] ) ) {
			$term_ids[ $taxonomy ][ $item['slug'] ] = uneti_seed_import_term( $item, $taxonomy );
		}
	}

	foreach ( $items as $item ) {
		if ( ! empty( $item['parent'] ) ) {
			$parent_id = isset( $term_ids[ $taxonomy ][ $item['parent'] ] ) ? $term_ids[ $taxonomy ][ $item['parent'] ] : 0;
			$term_ids[ $taxonomy ][ $item['slug'] ] = uneti_seed_import_term( $item, $taxonomy, $parent_id );
		}
	}
}

$default_data = isset( $site['defaultCategory'] ) ? $site['defaultCategory'] : array( 'slug' => 'sin-categoria', 'name' => 'Sin categoría' );
$default_term = term_exists( $default_data['slug'], 'category' );
if ( ! $default_term ) {
	$default_term = wp_insert_term( $default_data['name'], 'category', array( 'slug' => $default_data['slug'] ) );
}
if ( is_wp_error( $default_term ) ) {
	uneti_seed_fail( 'No se pudo crear la categoría por defecto: ' . $default_term->get_error_message() );
}
$default_id = (int) ( is_array( $default_term ) ? $default_term['term_id'] : $default_term );

$options = array(
	'blogname'              => $site['title'],
	'blogdescription'       => $site['description'],
	'WPLANG'                => $site['locale'],
	'timezone_string'       => $site['timezone'],
	'gmt_offset'            => $site['gmtOffset'],
	'date_format'           => $site['dateFormat'],
	'time_format'           => $site['timeFormat'],
	'start_of_week'         => $site['startOfWeek'],
	'posts_per_page'        => $site['postsPerPage'],
	'permalink_structure'   => $site['permalinkStructure'],
	'default_comment_status' => $site['defaultCommentStatus'],
	'thread_comments'       => $site['threadComments'],
	'thread_comments_depth' => $site['threadCommentsDepth'],
	'require_name_email'    => $site['requireNameEmail'],
	'show_avatars'          => $site['showAvatars'],
	'comment_moderation'    => $site['commentModeration'],
	'comment_registration'  => $site['commentRegistration'],
	'default_category'      => $default_id,
);

foreach ( $options as $option => $value ) {
	update_option( $option, $value );
}

function uneti_seed_import_media( $item, $input, $refresh_media, &$media_ids, &$media_urls ) {
	$file = ltrim( str_replace( '\\', '/', $item['file'] ), '/' );
	if ( '' === $file || false !== strpos( $file, '..' ) ) {
		uneti_seed_fail( 'Ruta de media inválida: ' . $item['file'] );
	}

	$media_root = realpath( trailingslashit( $input ) . 'media' );
	$source     = realpath( trailingslashit( $input ) . 'media/' . $file );
	if ( ! $media_root || ! $source || 0 !== strpos( $source, $media_root . DIRECTORY_SEPARATOR ) ) {
		uneti_seed_fail( 'No existe el original ' . $file . ' dentro de ' . $input . '/media' );
	}
	if ( ! is_file( $source ) ) {
		uneti_seed_fail( 'El original no es un archivo: ' . $source );
	}

	$sha = uneti_seed_sha256( $source );
	if ( ! empty( $item['sha256'] ) && ! hash_equals( $item['sha256'], $sha ) ) {
		uneti_seed_fail( 'SHA-256 no coincide para ' . $file );
	}

	$uploads = wp_upload_dir();
	$dest    = trailingslashit( $uploads['basedir'] ) . $file;
	if ( ! wp_mkdir_p( dirname( $dest ) ) ) {
		uneti_seed_fail( 'No se pudo crear el directorio de uploads para ' . $file );
	}

	$attachment_id = uneti_seed_find_attachment( $item['key'], $file );
	$created       = false;
	$needs_copy    = ! is_file( $dest );
	$needs_metadata = false;

	if ( $attachment_id ) {
		$current_file = (string) get_post_meta( $attachment_id, '_wp_attached_file', true );
		if ( $current_file !== $file ) {
			$needs_copy    = true;
			$needs_metadata = true;
		}
	}

	if ( $needs_copy || $refresh_media ) {
		// El original puede existir con otro propietario; el directorio de
		// uploads sí es escribible por www-data, así que se reemplaza.
		if ( file_exists( $dest ) && ! @unlink( $dest ) ) {
			uneti_seed_fail( 'No se pudo reemplazar ' . $dest );
		}
		if ( ! copy( $source, $dest ) ) {
			uneti_seed_fail( 'No se pudo copiar ' . $source . ' a ' . $dest );
		}
		@chmod( $dest, 0644 );
		$needs_metadata = true;
	}

	if ( ! $attachment_id ) {
		$args = array(
			'post_mime_type' => isset( $item['mime'] ) ? $item['mime'] : '',
			'post_title'     => isset( $item['title'] ) ? $item['title'] : basename( $file ),
			'post_content'   => isset( $item['description'] ) ? $item['description'] : '',
			'post_excerpt'   => isset( $item['caption'] ) ? $item['caption'] : '',
			'post_status'    => 'inherit',
			'guid'           => trailingslashit( $uploads['baseurl'] ) . $file,
		);
		if ( ! empty( $item['date'] ) ) {
			$args['post_date'] = $item['date'];
		}
		if ( ! empty( $item['dateGmt'] ) ) {
			$args['post_date_gmt'] = $item['dateGmt'];
		}

		$attachment_id = wp_insert_attachment( wp_slash( $args ), $dest, 0, true );
		if ( is_wp_error( $attachment_id ) ) {
			uneti_seed_fail( 'No se pudo crear el adjunto ' . $file . ': ' . $attachment_id->get_error_message() );
		}
		$created = true;
	} else {
		$update = array(
			'ID'           => $attachment_id,
			'post_title'   => isset( $item['title'] ) ? $item['title'] : basename( $file ),
			'post_content' => isset( $item['description'] ) ? $item['description'] : '',
			'post_excerpt' => isset( $item['caption'] ) ? $item['caption'] : '',
			'guid'         => trailingslashit( $uploads['baseurl'] ) . $file,
		);
		if ( ! empty( $item['date'] ) ) {
			$update['post_date'] = $item['date'];
		}
		if ( ! empty( $item['dateGmt'] ) ) {
			$update['post_date_gmt'] = $item['dateGmt'];
		}
		wp_update_post( wp_slash( $update ) );
	}

	update_post_meta( $attachment_id, '_wp_attached_file', $file );
	update_post_meta( $attachment_id, '_uneti_seed_key', $item['key'] );
	update_post_meta( $attachment_id, '_uneti_seed_archivo', basename( $file ) );
	update_post_meta( $attachment_id, '_uneti_seed_sha256', $sha );
	update_post_meta( $attachment_id, '_wp_attachment_image_alt', isset( $item['alt'] ) ? $item['alt'] : '' );
	if ( ! empty( $item['credit'] ) ) {
		update_post_meta( $attachment_id, '_uneti_seed_credit', $item['credit'] );
	}

	if ( $needs_metadata ) {
		$previous = wp_get_attachment_metadata( $attachment_id );
		if ( ! empty( $previous['sizes'] ) && is_array( $previous['sizes'] ) ) {
			foreach ( $previous['sizes'] as $size ) {
				if ( ! empty( $size['file'] ) ) {
					@unlink( trailingslashit( dirname( $dest ) ) . $size['file'] );
				}
			}
		}

		// También se eliminan variantes huérfanas o con otro propietario.
		$base      = pathinfo( $dest, PATHINFO_FILENAME );
		$extension = pathinfo( $dest, PATHINFO_EXTENSION );
		$variants  = glob( trailingslashit( dirname( $dest ) ) . $base . '-*.' . $extension );
		foreach ( (array) $variants as $variant ) {
			$suffix = substr( basename( $variant ), strlen( $base ) + 1, -( strlen( $extension ) + 1 ) );
			if ( preg_match( '/^\d+x\d+$/', $suffix ) || in_array( $suffix, array( 'scaled', 'rotated', 'e' ), true ) ) {
				@unlink( $variant );
			}
		}

		$metadata = wp_generate_attachment_metadata( $attachment_id, $dest );
		if ( is_wp_error( $metadata ) ) {
			uneti_seed_log( 'WARN: metadata de ' . $file . ': ' . $metadata->get_error_message() );
		} elseif ( $metadata ) {
			wp_update_attachment_metadata( $attachment_id, $metadata );
		}
	}

	$media_ids[ $item['key'] ]  = (int) $attachment_id;
	$media_urls[ $item['key'] ] = trailingslashit( $uploads['baseurl'] ) . $file;

	return array(
		'id'      => (int) $attachment_id,
		'created' => $created,
		'copied'  => $needs_copy || $refresh_media,
	);
}

$media_ids      = array();
$media_urls     = array();
$media_created  = 0;
$media_copied   = 0;

ksort( $media_by_key );
foreach ( $media_by_key as $item ) {
	$result = uneti_seed_import_media( $item, $input, $refresh_media, $media_ids, $media_urls );
	if ( $result['created'] ) {
		$media_created++;
	}
	if ( $result['copied'] ) {
		$media_copied++;
	}
}
uneti_seed_log( sprintf( 'Media: %d creados, %d archivos copiados.', $media_created, $media_copied ) );

usort(
	$posts,
	function ( $left, $right ) {
		return strcmp( $left['dateGmt'], $right['dateGmt'] );
	}
);

$post_keys    = array();
$comment_jobs = array();
$posts_created = 0;
$posts_updated = 0;
$posts_skipped = 0;

foreach ( $posts as $post ) {
	$post_keys[ $post['key'] ] = true;

	$post_id  = uneti_seed_find_post( $post['key'], $post['slug'] );
	$existing = $post_id > 0;

	if ( $existing && $skip_existing ) {
		$posts_skipped++;
	} else {
		$content = uneti_seed_resolve_content( $post['content'], $media_urls, $media_ids );
		$args    = array(
			'post_type'      => 'post',
			'post_status'    => $post['status'],
			'post_title'     => $post['title'],
			'post_name'      => $post['slug'],
			'post_excerpt'   => $post['excerpt'],
			'post_content'   => $content,
			'post_date'      => $post['date'],
			'post_date_gmt'  => $post['dateGmt'],
			'post_author'    => $author_id,
			'comment_status' => $post['commentStatus'],
			'ping_status'    => 'closed',
		);

		if ( $existing ) {
			$args['ID'] = $post_id;
			$result     = wp_update_post( wp_slash( $args ), true );
			if ( is_wp_error( $result ) ) {
				uneti_seed_fail( 'No se pudo actualizar ' . $post['slug'] . ': ' . $result->get_error_message() );
			}
			$posts_updated++;
		} else {
			$post_id = wp_insert_post( wp_slash( $args ), true );
			if ( is_wp_error( $post_id ) ) {
				uneti_seed_fail( 'No se pudo crear ' . $post['slug'] . ': ' . $post_id->get_error_message() );
			}
			$posts_created++;
		}

		update_post_meta( $post_id, '_uneti_seed_key', $post['key'] );

		$categories = isset( $post['categories'] ) ? $post['categories'] : array();
		$tags       = isset( $post['tags'] ) ? $post['tags'] : array();

		$term_result = wp_set_object_terms( $post_id, $categories, 'category', false );
		if ( is_wp_error( $term_result ) ) {
			uneti_seed_fail( 'Categorías de ' . $post['slug'] . ': ' . $term_result->get_error_message() );
		}
		$term_result = wp_set_object_terms( $post_id, $tags, 'post_tag', false );
		if ( is_wp_error( $term_result ) ) {
			uneti_seed_fail( 'Etiquetas de ' . $post['slug'] . ': ' . $term_result->get_error_message() );
		}

		if ( ! empty( $post['featuredMedia'] ) && isset( $media_ids[ $post['featuredMedia'] ] ) ) {
			set_post_thumbnail( $post_id, $media_ids[ $post['featuredMedia'] ] );
		} else {
			delete_post_thumbnail( $post_id );
		}

		clean_post_cache( $post_id );
	}

	$comment_jobs[] = array(
		'post_id'  => $post_id,
		'comments' => isset( $post['comments'] ) ? $post['comments'] : array(),
	);
}

uneti_seed_log(
	sprintf(
		'Posts: %d creados, %d actualizados, %d omitidos.',
		$posts_created,
		$posts_updated,
		$posts_skipped
	)
);

$comment_keys    = array();
$comment_ids     = array();
$comments_created = 0;
$comments_updated = 0;

foreach ( $comment_jobs as $job ) {
	foreach ( $job['comments'] as $comment ) {
		$comment_keys[ $comment['key'] ] = true;

		$comment_id = uneti_seed_find_comment(
			$comment['key'],
			$job['post_id'],
			$comment['author'],
			$comment['content']
		);

		$data = array(
			'comment_post_ID'      => $job['post_id'],
			'comment_author'       => $comment['author'],
			'comment_author_email' => isset( $comment['email'] ) ? $comment['email'] : '',
			'comment_content'      => $comment['content'],
			'comment_approved'     => $comment['approved'],
			'comment_type'         => 'comment',
			'comment_date'         => $comment['date'],
			'comment_date_gmt'     => $comment['dateGmt'],
			'comment_parent'       => 0,
		);

		if ( $comment_id ) {
			$data['comment_ID'] = $comment_id;
			$result             = wp_update_comment( wp_slash( $data ), true );
			if ( is_wp_error( $result ) ) {
				uneti_seed_fail( 'No se pudo actualizar el comentario ' . $comment['key'] . ': ' . $result->get_error_message() );
			}
			$comments_updated++;
		} else {
			$comment_id = wp_insert_comment( wp_slash( $data ) );
			if ( ! $comment_id ) {
				uneti_seed_fail( 'No se pudo crear el comentario ' . $comment['key'] );
			}
			$comments_created++;
		}

		update_comment_meta( $comment_id, '_uneti_seed_key', $comment['key'] );
		$comment_ids[ $comment['key'] ] = (int) $comment_id;
	}
}

foreach ( $comment_jobs as $job ) {
	foreach ( $job['comments'] as $comment ) {
		if ( empty( $comment['parent'] ) || ! isset( $comment_ids[ $comment['parent'] ] ) ) {
			continue;
		}

		$comment_id = $comment_ids[ $comment['key'] ];
		$parent_id  = $comment_ids[ $comment['parent'] ];
		$current    = get_comment( $comment_id );

		if ( $current && (int) $current->comment_parent !== (int) $parent_id ) {
			wp_update_comment(
				array(
					'comment_ID'     => $comment_id,
					'comment_parent' => $parent_id,
				)
			);
		}
	}

	wp_update_comment_count( $job['post_id'] );
}

uneti_seed_log(
	sprintf(
		'Comentarios: %d creados, %d actualizados.',
		$comments_created,
		$comments_updated
	)
);

$pruned_posts    = 0;
$pruned_media    = 0;
$pruned_comments = 0;

if ( $prune ) {
	$seed_posts = get_posts(
		array(
			'post_type'      => 'post',
			'post_status'    => 'any',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_key'       => '_uneti_seed_key',
		)
	);
	foreach ( $seed_posts as $seed_post_id ) {
		$key = (string) get_post_meta( $seed_post_id, '_uneti_seed_key', true );
		if ( ! isset( $post_keys[ $key ] ) ) {
			wp_delete_post( $seed_post_id, true );
			$pruned_posts++;
		}
	}

	$seed_media = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'posts_per_page' => -1,
			'fields'         => 'ids',
			'meta_key'       => '_uneti_seed_key',
		)
	);
	foreach ( $seed_media as $seed_media_id ) {
		$key = (string) get_post_meta( $seed_media_id, '_uneti_seed_key', true );
		if ( ! isset( $media_by_key[ $key ] ) ) {
			wp_delete_attachment( $seed_media_id, true );
			$pruned_media++;
		}
	}

	$seed_comments = get_comments(
		array(
			'meta_key'   => '_uneti_seed_key',
			'meta_compare' => 'EXISTS',
			'status'     => 'all',
		)
	);
	foreach ( $seed_comments as $seed_comment ) {
		$key = (string) get_comment_meta( $seed_comment->comment_ID, '_uneti_seed_key', true );
		if ( ! isset( $comment_keys[ $key ] ) ) {
			wp_delete_comment( $seed_comment->comment_ID, true );
			$pruned_comments++;
		}
	}

	uneti_seed_log(
		sprintf(
			'Prune: %d posts, %d media, %d comentarios eliminados.',
			$pruned_posts,
			$pruned_media,
			$pruned_comments
		)
	);
}

wp_cache_flush();
flush_rewrite_rules( false );

uneti_seed_result(
	array(
		'ok'              => true,
		'posts'           => count( $post_keys ),
		'postsCreated'    => $posts_created,
		'postsUpdated'    => $posts_updated,
		'media'           => count( $media_ids ),
		'mediaCreated'    => $media_created,
		'comments'        => count( $comment_keys ),
		'commentsCreated' => $comments_created,
		'pruned'          => array(
			'posts'    => $pruned_posts,
			'media'    => $pruned_media,
			'comments' => $pruned_comments,
		),
	)
);
