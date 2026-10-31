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
	}
);

/* Mensaje genérico de login. */
add_filter(
	'login_errors',
	function () {
		return 'Las credenciales no son correctas.';
	}
);
