<?php
/**
 * Instalación limpia de WordPress para un entorno recién creado.
 *
 * - Si la base está vacía, ejecuta wp_install().
 * - Activa WPGraphQL.
 * - No importa contenido: eso lo hace seed/importar.php.
 *
 * Uso:
 *   php /opt/uneti-scripts/bootstrap.php \
 *     --title=UNETI --admin-user=admin --admin-password=... --admin-email=...
 *
 * También acepta WORDPRESS_TITLE, WORDPRESS_ADMIN_USER,
 * WORDPRESS_ADMIN_PASSWORD y WORDPRESS_ADMIN_EMAIL.
 */

if ( 'cli' !== PHP_SAPI ) {
	exit( 1 );
}

if ( ! is_file( '/var/www/html/wp-config.php' ) ) {
	fwrite( STDERR, "ERROR: falta /var/www/html/wp-config.php\n" );
	exit( 1 );
}

// Permite cargar WordPress aunque is_blog_installed() sea falso.
define( 'WP_INSTALLING', true );

require_once '/var/www/html/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/upgrade.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';
require_once __DIR__ . '/seed/lib.php';

$title    = uneti_seed_arg( 'title', getenv( 'WORDPRESS_TITLE' ) ?: 'UNETI' );
$user     = uneti_seed_arg( 'admin-user', getenv( 'WORDPRESS_ADMIN_USER' ) ?: 'admin' );
$email    = uneti_seed_arg( 'admin-email', getenv( 'WORDPRESS_ADMIN_EMAIL' ) ?: 'admin@example.com' );
$password = uneti_seed_arg( 'admin-password', getenv( 'WORDPRESS_ADMIN_PASSWORD' ) ?: '' );

$installed = is_blog_installed();
$admin_id  = 0;

if ( ! $installed ) {
	if ( '' === $password ) {
		uneti_seed_fail( 'WORDPRESS_ADMIN_PASSWORD es obligatoria para instalar WordPress.' );
	}

	$result = wp_install( $title, $user, $email, true, '', $password, '' );
	if ( is_wp_error( $result ) ) {
		uneti_seed_fail( 'wp_install falló: ' . $result->get_error_message() );
	}

	$admin_id = isset( $result['user_id'] ) ? (int) $result['user_id'] : 0;
	wp_installing( false );
	wp_set_current_user( $admin_id );

	// El contenido de ejemplo no forma parte del sitio UNETI.
	$defaults = get_posts(
		array(
			'post_type'      => array( 'post', 'page' ),
			'post_status'    => 'any',
			'posts_per_page' => -1,
			'fields'         => 'ids',
		)
	);
	foreach ( $defaults as $default_id ) {
		wp_delete_post( $default_id, true );
	}

	$default_comments = get_comments( array( 'status' => 'any' ) );
	foreach ( $default_comments as $default_comment ) {
		wp_delete_comment( $default_comment->comment_ID, true );
	}

	uneti_seed_log( 'WordPress instalado y contenido de ejemplo eliminado.' );
} else {
	wp_installing( false );

	$admin = get_user_by( 'login', $user );
	if ( ! $admin ) {
		$admins = get_users(
			array(
				'role'   => 'administrator',
				'number' => 1,
				'fields' => 'ID',
			)
		);
		$admin_id = $admins ? (int) $admins[0] : 0;
	} else {
		$admin_id = (int) $admin->ID;
	}

	if ( $admin_id ) {
		wp_set_current_user( $admin_id );
	}
	uneti_seed_log( 'WordPress ya estaba instalado; no se modificó el contenido.' );
}

$plugin = 'wp-graphql/wp-graphql.php';
if ( ! is_plugin_active( $plugin ) ) {
	$activated = activate_plugin( $plugin );
	if ( is_wp_error( $activated ) ) {
		uneti_seed_fail( 'No se pudo activar WPGraphQL: ' . $activated->get_error_message() );
	}
	uneti_seed_log( 'WPGraphQL activado.' );
} else {
	uneti_seed_log( 'WPGraphQL ya estaba activo.' );
}

wp_cache_flush();
flush_rewrite_rules( false );

uneti_seed_emit(
	'UNETI_SEED_BOOTSTRAP',
	array(
		'ok'        => true,
		'installed' => ! $installed,
		'adminId'   => $admin_id,
		'homeUrl'   => uneti_seed_site_url(),
		'graphql'   => is_plugin_active( $plugin ),
	)
);
