<?php
/**
 * Plugin Name: UNETI Seguridad
 * Description: Endurecimiento básico del WordPress headless: XML-RPC, enumeración de usuarios y cabeceras.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/* XML-RPC y pingback deshabilitados. */
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'wp_is_application_passwords_available', '__return_false' );
add_filter(
	'wp_headers',
	function ( $headers ) {
		unset( $headers['X-Pingback'] );
		return $headers;
	}
);

/* Elimina metadatos innecesarios del head. */
add_action(
	'init',
	function () {
		remove_action( 'wp_head', 'wp_generator' );
		remove_action( 'wp_head', 'rsd_link' );
		remove_action( 'wp_head', 'wlwmanifest_link' );
		remove_action( 'wp_head', 'wp_shortlink_wp_head' );
		remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10 );
	}
);
add_filter( 'the_generator', '__return_empty_string' );

/* No expone el listado de usuarios por REST a visitantes anónimos. */
add_filter(
	'rest_endpoints',
	function ( $endpoints ) {
		if ( is_user_logged_in() ) {
			return $endpoints;
		}

		foreach ( array_keys( $endpoints ) as $ruta ) {
			if ( 0 === strpos( $ruta, '/wp/v2/users' ) ) {
				unset( $endpoints[ $ruta ] );
			}
		}

		return $endpoints;
	}
);

/* No expone el sitemap de usuarios (enumeración por wp-sitemap-users-*.xml). */
add_filter(
	'wp_sitemaps_add_provider',
	function ( $proveedor, $nombre ) {
		if ( 'users' === $nombre ) {
			return false;
		}

		return $proveedor;
	},
	10,
	2
);

/* Evita la enumeración por ?author=N. */
add_action(
	'template_redirect',
	function () {
		if ( is_author() ) {
			wp_safe_redirect( home_url( '/' ), 301 );
			exit;
		}
	}
);

/* Cabeceras de seguridad desde `init`, incluidas las pantallas de login y admin. */
add_action(
	'init',
	function () {
		if ( headers_sent() ) {
			return;
		}

		header( 'X-Content-Type-Options: nosniff' );
		header( 'Permissions-Policy: camera=(), microphone=(), geolocation=()' );
	},
	1
);

/* Cabeceras de seguridad para las respuestas dinámicas de WordPress. */
add_action(
	'send_headers',
	function () {
		header( 'X-Content-Type-Options: nosniff' );
		header( 'X-Frame-Options: SAMEORIGIN' );
		header( 'Referrer-Policy: strict-origin-when-cross-origin' );
		header( 'Permissions-Policy: camera=(), microphone=(), geolocation=()' );
		header( 'Cross-Origin-Opener-Policy: same-origin' );
		header( 'X-Permitted-Cross-Domain-Policies: none' );

		if ( is_ssl() ) {
			header( 'Strict-Transport-Security: max-age=31536000; includeSubDomains' );
		}
	}
);

/* Pingbacks internos desactivados. */
add_filter( 'pings_open', '__return_false', 10, 0 );

/* Límite de intentos de acceso: 5 fallos por IP en 15 minutos. */
const UNETI_SEG_LOGIN_MAX     = 5;
const UNETI_SEG_LOGIN_VENTANA = 900;

function uneti_seg_ip_hash() {
	$ip = isset( $_SERVER['REMOTE_ADDR'] )
		? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) )
		: '0.0.0.0';

	return md5( $ip );
}

add_filter(
	'authenticate',
	function ( $usuario, $nombre ) {
		if ( empty( $nombre ) ) {
			return $usuario;
		}

		$intentos = (int) get_transient( 'uneti_seg_login_' . uneti_seg_ip_hash() );

		if ( $intentos >= UNETI_SEG_LOGIN_MAX ) {
			return new WP_Error(
				'uneti_seg_bloqueado',
				'Demasiados intentos. Inténtalo de nuevo más tarde.'
			);
		}

		return $usuario;
	},
	30,
	2
);

add_action(
	'wp_login_failed',
	function () {
		$clave    = 'uneti_seg_login_' . uneti_seg_ip_hash();
		$intentos = (int) get_transient( $clave );

		set_transient( $clave, $intentos + 1, UNETI_SEG_LOGIN_VENTANA );
	}
);

add_action(
	'wp_login',
	function () {
		delete_transient( 'uneti_seg_login_' . uneti_seg_ip_hash() );
	}
);

/* Mensaje genérico de login. */
add_filter(
	'login_errors',
	function () {
		return 'Las credenciales no son correctas.';
	}
);

/* Fuerza HTTPS en el panel cuando el despliegue lo indique. */
if ( '1' === (string) getenv( 'WP_FORCE_SSL' ) ) {
	define( 'FORCE_SSL_ADMIN', true );
}
