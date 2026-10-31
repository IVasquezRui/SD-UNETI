#!/usr/bin/env bash
# Crea el .env efímero de CI. No se ejecuta fuera de CI para no pisar el .env local.
set -euo pipefail

if [ -f .env ] && [ "${CI:-}" != "true" ]; then
  echo "Ya existe .env; no se sobrescribe fuera de CI." >&2
  exit 1
fi

cat > .env <<'EOF'
COMPOSE_PROJECT_NAME=uneti-ci
MYSQL_ROOT_PASSWORD=ci-root-password
MYSQL_DATABASE=wordpress_db
MYSQL_USER=wp_user
MYSQL_PASSWORD=ci-wordpress-password
DB_DATA_DIR=/tmp/uneti-ci/db_data
WORDPRESS_PORT=8080
WORDPRESS_URL=http://localhost:8080
WORDPRESS_TITLE=UNETI
WORDPRESS_ADMIN_USER=admin
WORDPRESS_ADMIN_PASSWORD=ci-admin-password
WORDPRESS_ADMIN_EMAIL=admin@example.com
WP_DATA_DIR=/tmp/uneti-ci/wp_data
UNETI_FORM_TOKEN=ci-form-token
FRONTEND_PORT=3000
SITE_URL=http://localhost:3000
MARIADB_IMAGE=mariadb:11.8.9
WORDPRESS_IMAGE=wordpress:7.1.4-php8.5-apache
NODE_IMAGE=node:26.13.0-slim
MARIADB_CONTAINER_NAME=uneti-ci-db
WORDPRESS_CONTAINER_NAME=uneti-ci-wp
FRONTEND_CONTAINER_NAME=uneti-ci-frontend
NETWORK_NAME=uneti-ci-net
EOF

chmod 600 .env
echo "Entorno de CI creado en .env"
