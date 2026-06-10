# Proxy — Configuraciones Custom de Nginx (NPM)

Esta carpeta se monta como volumen en el contenedor `SD-UNETI_npm` en la ruta `/data/nginx/custom/`. Los archivos aquí se inyectan automáticamente en la configuración de Nginx Proxy Manager.

## Archivos

| Archivo | Contexto de Nginx | Descripción |
|---|---|---|
| `http.conf` | Bloque `http {}` | Servidor default que devuelve 404 a requests sin dominio válido |
| `server_proxy.conf` | Cada `server {}` de proxy | Restricción de acceso a `/wp-admin` por IP de Tailscale |

## Equipos Autorizados para wp-admin

| Usuario | IP Tailscale | Hostname |
|---|---|---|
| enrique | 100.126.137.66 | canaima-archcraft-ed |
| windows | 100.92.160.7 | servllm-uneti |
| ivanCanaima | 100.115.223.23 | canaima-f1 |
| ivanMac | 100.102.14.91 | ivan-mac-1 ⚠️ |

> ⚠️ La Mac de ivan cambia de IP en cada reinicio. Ver sección de mantenimiento.

## Mantenimiento

### Actualizar IP de la Mac de Ivan

```bash
# 1. Ver la nueva IP
tailscale status | grep ivan-mac

# 2. Editar server_proxy.conf y cambiar la IP de ivanMac

# 3. Recargar nginx (sin reiniciar el contenedor)
docker exec SD-UNETI_npm nginx -s reload
```

### Agregar un nuevo equipo autorizado

1. Obtener la IP de Tailscale del equipo: `tailscale status`
2. Editar `server_proxy.conf`
3. Agregar `allow <IP>;` en AMBOS bloques (`/wp-admin` y `/wp-login.php`)
4. Recargar: `docker exec SD-UNETI_npm nginx -s reload`

### Verificar configuración

```bash
# Validar sintaxis
docker exec SD-UNETI_npm nginx -t

# Recargar sin downtime
docker exec SD-UNETI_npm nginx -s reload
```

## Arquitectura WordPress Headless

```
                     Tailscale (100.77.149.53)
                              │
                    ┌─────────┴─────────┐
                    │   NPM (puerto 80)  │
                    └─────────┬─────────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
    wp.uneti.local    netx.uneti.local    IP directa
         │                    │               │
    WordPress:80       Next.js:3000       → 404
    (Headless CMS)     (Frontend SSR)
         │                    │
         └────── GraphQL ─────┘
              (red Docker interna)
```

- **Frontend público**: `netx.uneti.local` → Next.js (React + shadcn + Framer Motion)
- **Backend CMS**: `wp.uneti.local` → WordPress con WPGraphQL
- **Admin restringido**: `wp.uneti.local/wp-admin` → Solo IPs autorizadas (Tailscale)
- **API abierta**: `wp.uneti.local/graphql` y `/wp-json` → Acceso público (lectura)
