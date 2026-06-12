<?php
/**
 * Plugin Name: Headless Mode & CORS
 * Description: Redirects frontend requests to Next.js and configures CORS for the Headless CMS.
 * Version: 1.0
 * Author: Antigravity
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Configure CORS headers for the Headless APIs
 */
add_action('init_graphql_request', function() {
    header('Access-Control-Allow-Origin: *'); // For production, you might want to restrict this to netx.uneti.local
    header('Access-Control-Allow-Headers: Authorization, Content-Type');
    header('Access-Control-Allow-Credentials: true');
});

/**
 * Redirect frontend requests to the Next.js app.
 * We want to allow access to WP Admin, login, GraphQL, REST API, and cron.
 * Everything else gets redirected.
 */
add_action( 'template_redirect', function() {
    // Check if it's an API request, admin, or cron
    if ( is_admin() ) {
        return;
    }
    
    if ( defined( 'DOING_CRON' ) && DOING_CRON ) {
        return;
    }

    if ( defined( 'REST_REQUEST' ) && REST_REQUEST ) {
        return;
    }
    
    $req_uri = $_SERVER['REQUEST_URI'];
    
    // Allow GraphQL and REST endpoints to pass through
    if ( strpos( $req_uri, '/graphql' ) === 0 || strpos( $req_uri, '/wp-json' ) === 0 ) {
        return;
    }

    // Allow login and register pages
    if ( strpos( $req_uri, 'wp-login.php' ) !== false || strpos( $req_uri, 'wp-register.php' ) !== false ) {
        return;
    }

    // Redirect to the Next.js frontend
    // Use the public frontend URL defined in your infrastructure
    $frontend_url = 'http://netx.uneti.local';
    
    // Append the requested path to the frontend URL
    $redirect_url = rtrim( $frontend_url, '/' ) . $req_uri;
    
    wp_redirect( $redirect_url, 301 );
    exit;
});
