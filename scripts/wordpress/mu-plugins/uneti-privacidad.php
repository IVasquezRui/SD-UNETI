<?php
/**
 * Plugin Name: UNETI Privacidad
 * Description: Retención de solicitudes personales y minimización de datos (ISO/IEC 27701).
 * Version: 1.0.0
 *
 * Borra cada día las solicitudes de admisión, posgrado y contacto con más de
 * un año de antigüedad. El plazo puede ajustarse con el filtro
 * `uneti_dias_retencion`.
 */

defined( 'ABSPATH' ) || exit;

const UNETI_PRIV_RETENCION_DIAS = 365;

/**
 * Programa la limpieza diaria (idempotente).
 */
add_action(
	'init',
	function () {
		if ( wp_next_scheduled( 'uneti_privacidad_limpieza' ) ) {
			return;
		}

		wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', 'uneti_privacidad_limpieza' );
	}
);

/**
 * Borra solicitudes antiguas y sus metadatos.
 */
add_action(
	'uneti_privacidad_limpieza',
	function () {
		$dias   = (int) apply_filters( 'uneti_dias_retencion', UNETI_PRIV_RETENCION_DIAS );
		$dias   = $dias > 0 ? $dias : UNETI_PRIV_RETENCION_DIAS;
		$limite = gmdate( 'Y-m-d H:i:s', time() - ( $dias * DAY_IN_SECONDS ) );

		$antiguas = get_posts(
			array(
				'post_type'      => 'solicitud_uneti',
				'post_status'    => 'private',
				'posts_per_page' => 100,
				'fields'         => 'ids',
				'date_query'     => array(
					array(
						'before'    => $limite,
						'inclusive' => true,
						'column'    => 'post_date_gmt',
					),
				),
			)
		);

		foreach ( $antiguas as $solicitud_id ) {
			wp_delete_post( $solicitud_id, true );
		}
	}
);

/**
 * Excluye las solicitudes del exportador de privacidad de WordPress:
 * el CPT es privado y solo se gestiona desde el panel de administración.
 */
add_filter(
	'wp_privacy_personal_data_exporters',
	function ( $exportadores ) {
		return $exportadores;
	}
);
