# Endurecimiento del portal UNETI — 2026-11-08

Documento de trabajo del punto 21 del plan `2026-11-08/doc-as-code_2026-11-08.md`.
Describe los controles técnicos aplicados al portal (Next.js + WordPress headless) y su
correspondencia con **SOC 2 (Trust Services Criteria)**, **ISO/IEC 27001:2022** e
**ISO/IEC 27701:2019**.

---

## 1. Alcance y activos

| Activo | Descripción | Ubicación |
| --- | --- | --- |
| Portal público | Next.js 16 (App Router) en `frontend/` | Contenedor `uneti_frontend` |
| WordPress headless | API REST + GraphQL, panel de administración | Contenedor `uneti_wordpress` |
| Base de datos | MariaDB con contenido y solicitudes | Contenedor `uneti_db` + `db_data/` |
| Solicitudes personales | CPT privado `solicitud_uneti` | WordPress |
| Configuración y secretos | `.env` (no versionado) | Host |
| Repositorio y CI | GitHub `IVasquezRui/SD-UNETI` | GitHub Actions |

**Datos personales tratados:** nombre, cédula, correo, teléfono, programa de interés, mensaje,
comentarios públicos e IP (solo como hash). No se tratan datos sensibles ni de menores de forma
deliberada.

## 2. Modelo de amenazas (resumen)

| Amenaza | Vector | Control aplicado |
| --- | --- | --- |
| Fuerza bruta al panel | `/wp-login.php`, XML-RPC | Límite 5/15 min, XML-RPC off, mensaje genérico |
| Spam y abuso de formularios | `/api/admisiones`, `/api/contacto`, `/api/posgrados` | Rate limit, honeypot, tiempo mínimo, límite de cuerpo |
| Inyección / XSS | JSON de entrada, comentarios | Validación, saneamiento WP, CSP, escape de React |
| CSRF de origen cruzado | POST a `/api/*` | Verificación de `Origin` contra host y sitio configurado |
| Enumeración de usuarios | `?author=N`, `/wp/v2/users`, sitemap de usuarios | Redirección, endpoints ocultos, sitemap sin usuarios |
| Exposición de archivos | `.env`, `.git`, respaldos, logs | Reglas Apache + cabeceras |
| Fuga de secretos | Repositorio | `.gitignore`, gitleaks en CI |
| Revalidación no autorizada | `/api/revalidar` | Token servidor-a-servidor con comparación en tiempo constante |
| Clickjacking / sniffing | Navegador | `X-Frame-Options`, CSP `frame-ancestors`, `nosniff`, COOP/CORP |
| Retención excesiva de datos | Solicitudes antiguas | Borrado automático diario a los 12 meses |

## 3. Controles implementados

### 3.1 Gobierno y gestión de cambios

- Flujo obligatorio por ramas: cada punto del plan en un commit descriptivo y PR temático a `main`.
- CI en GitHub Actions: TypeScript, ESLint, build, formularios, despliegue y **seguridad**
  (`.github/workflows/09-seguridad.yml`).
- Revisión de dependencias mensual programada (`cron: 0 6 1 * *`).
- Historial auditable en Git con commits atómicos por punto.

### 3.2 Identidad y acceso

- Token `UNETI_FORM_TOKEN` compartido entre Next.js y WordPress para `POST /wp-json/uneti/v1/solicitudes`.
- Token independiente `UNETI_REVALIDATE_TOKEN` para `/api/revalidar`, comparado con
  `timingSafeEqual` (`app/lib/security.ts`).
- Contraseñas de aplicación de WordPress deshabilitadas y XML-RPC bloqueado.
- Límite de intentos de acceso y errores genéricos (`uneti-seguridad.php`).
- Acceso al panel restringido por red en el despliegue (documentado en `Documents/`).

### 3.3 Cifrado en tránsito

- `Strict-Transport-Security` (HSTS) en producción y en WordPress con `is_ssl()`.
- `upgrade-insecure-requests` en la CSP de producción.
- El TLS del host se termina en el proxy del despliegue (documentar certificado y renovación).

### 3.4 Seguridad de aplicaciones

- Cabeceras globales en `next.config.ts`: CSP, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`,
  `Cross-Origin-Resource-Policy`, `X-Permitted-Cross-Domain-Policies`, `Origin-Agent-Cluster`.
- Límites de cuerpo por ruta (`LIMITE_CUERPO_FORMULARIO`, `LIMITE_CUERPO_COMENTARIO`,
  `LIMITE_CUERPO_REVALIDACION`) que no confían en `Content-Length`.
- Rate limiting en memoria por IP y ruta: formularios 5/10 min, comentarios 10/10 min,
  noticias 120/min, stream 20/min, revalidación 20/min.
- Validación y saneamiento de entradas, honeypot y tiempo mínimo anti-bot.
- `security.txt`, `robots.txt`, `sitemap.xml` y política de privacidad publicados.

### 3.5 Registro, monitoreo y pruebas

- `npm run qa` (28/28 comprobaciones), `scripts/ci/probar-formulario.mjs` (12/12),
  `scripts/ci/pentest-nextjs.sh` (cabeceras, archivos, métodos, origen, source maps).
- Healthchecks de Docker para MariaDB, WordPress y Next.js.
- Alertas de CI ante vulnerabilidades altas o críticas en dependencias de producción.

### 3.6 Privacidad (ISO/IEC 27701)

- Minimización: solo los datos necesarios por formulario; IP almacenada como hash.
- Finalidad y base de licitud documentadas en `/privacidad` y en el consentimiento de cada formulario.
- Retención automática de 12 meses para solicitudes (`uneti-privacidad.php`).
- Derechos de acceso, rectificación, supresión, oposición y portabilidad con canal de contacto.
- Sin cookies publicitarias; aviso de terceros para mapas y videos incrustados.

## 4. Correspondencia de controles

### 4.1 SOC 2 — Trust Services Criteria

| Criterio | Control en el portal |
| --- | --- |
| CC6.1 | Control de acceso lógico: tokens, panel restringido, sin usuarios expuestos |
| CC6.6 | Protección perimetral: cabeceras, CSP, COOP/CORP, bloqueo de archivos |
| CC6.7 | Transmisión protegida: HSTS, `upgrade-insecure-requests`, TLS en el proxy |
| CC6.8 | Prevención de software malicioso: límites de carga, PHP bloqueado en uploads |
| CC7.1 | Detección: pentest automatizado, `security.txt`, dependencias auditadas |
| CC7.2 | Monitoreo: healthchecks, logs de WordPress, CI mensual |
| CC7.3 | Evaluación de incidentes: registro de tickets y canal de reporte |
| CC7.4 | Respuesta: procedimiento en la sección 6 |
| CC8.1 | Gestión de cambios: PR por punto, CI obligatorio, historial Git |
| CC9.2 | Proveedores: imágenes fijadas y auditoría de dependencias |
| P1–P8 | Privacidad: consentimiento, finalidad, retención, derechos y seguridad |

### 4.2 ISO/IEC 27001:2022 — Anexo A

| Control | Implementación |
| --- | --- |
| A.5.1 / A.5.2 | Política de seguridad descrita aquí y en `/privacidad` |
| A.5.7 | Inteligencia de amenazas: `npm audit`, gitleaks, nuclei opcional |
| A.5.10 | Uso aceptable de activos: alcance de contenedores y datos |
| A.5.12–A.5.14 | Clasificación: solicitudes privadas, contenido público, secretos en `.env` |
| A.5.15–A.5.18 | Accesos: tokens, mínimo privilegio, revisión de PR |
| A.5.23 | Servicios en la nube: imágenes oficiales, volúmenes locales |
| A.5.34 | Privacidad desde el diseño: minimización y retención |
| A.6.8 | Reporte de eventos: `security.txt` y correo institucional |
| A.7.1–A.7.4 | Instalaciones y ubicación de equipos del despliegue |
| A.7.10 | Soportes de almacenamiento: `db_data/`, respaldos documentados |
| A.8.1–A.8.5 | Inventario de activos, roles y autenticación |
| A.8.8 | Vulnerabilidades técnicas: `npm audit`, pentest, actualizaciones |
| A.8.9 | Configuración segura: `next.config.ts`, `seguridad.conf`, `seguridad.ini`, compose |
| A.8.10 | Eliminación de información: limpieza de solicitudes a los 12 meses |
| A.8.11 | Enmascaramiento: IP como hash |
| A.8.12 | Prevención de fuga: CSP, sin source maps, `.env` fuera del repo |
| A.8.15 / A.8.16 | Registro y monitoreo: logs de contenedores y CI |
| A.8.20–A.8.23 | Seguridad de redes y web: cabeceras, Apache endurecido, WAF en el host |
| A.8.24 | Criptografía: TLS, tokens aleatorios de 32 bytes |
| A.8.25 / A.8.28 | Ciclo de vida seguro: PR, revisión, CI |
| A.8.31 / A.8.32 | Separación de entornos y gestión de cambios |
| A.8.34 | Protección en auditorías: no se exportan datos del CPT privado |

### 4.3 ISO/IEC 27701:2019 — Privacidad

| Requisito | Implementación |
| --- | --- |
| 7.2.1 | Rol: UNETI como responsable del tratamiento |
| 7.2.2 | Condiciones para la recolección: consentimiento explícito en formularios |
| 7.2.5 | Finalidad: admisiones, contacto, comentarios y seguridad |
| 7.2.6 | Limitación de la recolección: solo campos necesarios |
| 7.3.2 | Base legal y consentimiento documentados |
| 7.4.1–7.4.4 | Transparencia: `/privacidad`, aviso de cookies y terceros |
| 8.2.1 | Calidad de los datos: validación de correo, cédula y longitudes |
| 8.5.1 | Derechos de las personas: canal de contacto y plazos de respuesta |
| 8.5.4 | Supresión: retención máxima de 12 meses |

## 5. Evidencias y comandos

```bash
# Contenedores y configuración
docker compose config -q
docker compose ps

# Frontend
cd frontend && npx tsc --noEmit && npm run lint && npm audit --omit=dev --audit-level=high

# QA funcional y de seguridad
bash scripts/ci/qa-frontend.sh
node scripts/ci/probar-formulario.mjs
bash scripts/ci/pentest-nextjs.sh http://localhost:3000

# WordPress
docker compose exec wordpress php -l /var/www/html/wp-content/mu-plugins/uneti-seguridad.php
docker compose exec wordpress php -l /var/www/html/wp-content/mu-plugins/uneti-privacidad.php
```

Los reportes se guardan en `reportes/` (no versionado).

## 6. Respuesta a incidentes (resumen operativo)

1. **Detección**: alerta de CI, reporte por `security.txt`, revisión de logs o aviso interno.
2. **Contención**: retirar el contenedor afectado, rotar `UNETI_FORM_TOKEN` y
   `UNETI_REVALIDATE_TOKEN`, revocar sesiones de WordPress.
3. **Erradicación**: aplicar el parche en una rama, ejecutar CI y desplegar por PR.
4. **Recuperación**: restaurar `db_data/` desde el respaldo más reciente y validar con
   `qa-frontend.sh` y `probar-formulario.mjs`.
5. **Lecciones**: registrar el incidente en `Documents/seguridad/` y actualizar controles.

**Plazos objetivo:** acuse de recibo en 72 h, contención en 5 días hábiles, cierre con informe.

## 7. Riesgos residuales y hoja de ruta

| Riesgo | Mitigación actual | Siguiente paso |
| --- | --- | --- |
| CSP con `'unsafe-inline'` | Sin scripts de terceros; React escapa por defecto | Nonces con `middleware`/`proxy` en Next 16 |
| Rate limit en memoria | Límite por proceso | Redis compartido si se escala horizontal |
| TLS en el host | Documentado | Certificado gestionado + renovación automática |
| MFA en WordPress | Login limitado | Plugin MFA o SSO institucional |
| Respaldos | `db_data/` local | Copia cifrada fuera del host y prueba de restauración |
| Monitoreo | Healthchecks + CI | Alertas a correo/Telegram ante caídas |
| TRACE / TRACK | `proxy.ts` los corta antes del handler (Next responde 500 fail closed) | Devolver 405 en el proxy inverso del despliegue |

## 8. Checklist de verificación

- [x] Cabeceras de seguridad en Next.js y WordPress.
- [x] CSP restrictiva con `script-src-attr 'none'` y `frame-ancestors 'self'`.
- [x] Límite de cuerpo y rate limit en todas las rutas que escriben.
- [x] Token de revalidación con comparación en tiempo constante.
- [x] XML-RPC, pingbacks y enumeración de usuarios bloqueados.
- [x] Límite de intentos de acceso y errores genéricos.
- [x] Apache y PHP endurecidos; uploads sin PHP; respaldos inaccesibles.
- [x] `security.txt`, `robots.txt`, `sitemap.xml` y `/privacidad`.
- [x] Retención automática de solicitudes a los 12 meses.
- [x] CI de seguridad con `npm audit`, gitleaks y validación de compose.
- [x] `docker compose` con `no-new-privileges`, `pids_limit` y healthchecks.

