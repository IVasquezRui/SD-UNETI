# Pasos a producción — UNETI en Proxmox

**Guía universal de despliegue del Portal Web Soberanía Digital 2026 (SD-UNETI)**

| Campo | Valor |
|---|---|
| Proyecto | SD-UNETI — Portal Web Institucional |
| Institución | Universidad Nacional Experimental de las Telecomunicaciones e Informática (UNETI) |
| Versión del documento | 1.0 |
| Fecha | 11/11/2026 |
| Audiencia | Ingeniero/a de infraestructura, operaciones y soporte |
| Alcance | Proxmox VE (VM o LXC), Docker Compose, instalación nativa e híbrida |
| Autor | Hecho por → Iván Vásquez |

> **Regla de oro:** este documento contiene **nombres de variables y usuarios**, nunca contraseñas reales. Cada valor se genera en el servidor y se guarda fuera del repositorio (gestor de secretos o archivo con permisos `600`).

---

## 0. Cómo elegir la topología

| Ruta | Cuándo usarla | Complejidad | Reproducibilidad | Recomendación |
|---|---|---|---|---|
| **A. Docker Compose en VM** | Caso normal: se quiere desplegar rápido y actualizar por imagen | Media | Alta | **Recomendada** |
| **B. Instalación nativa en VM** | La institución no permite Docker o exige paquetes del sistema | Alta | Media | Alternativa institucional |
| **C. Híbrida** | WordPress en Docker y Next.js nativo (o al revés) | Media-alta | Media | Solo si hay una restricción concreta |
| **LXC** | Se quiere ahorrar recursos | Media | Media | Solo con `nesting=1` y pruebas previas |

**Recomendación:** una **VM Debian 13** (no LXC) con Docker Compose para el stack y **Caddy instalado en el host** como proxy TLS. Motivo: Caddy en el host ve la IP real del cliente (necesario para Tailscale y `wp-admin`), mientras que dentro de Docker vería la IP del puente.

```text
Internet
   │  80 / 443
   ▼
┌──────────────────────── VM Debian 13 (Proxmox) ────────────────────────┐
│  Caddy 2 (systemd) ── TLS automático, HSTS, logs                       │
│      │ 127.0.0.1:3000                        │ 127.0.0.1:8080          │
│      ▼                                        ▼                        │
│  ┌────────────────────── Docker Compose ──────────────────────┐        │
│  │ frontend (Next.js build)   wordpress (PHP 8.5 + Apache)    │        │
│  │            └───────────────► db (MariaDB, sin puerto)      │        │
│  └────────────────────────────────────────────────────────────┘        │
│                                                                        │
│  UFW: 80/443 públicos · 22 y 8006 solo por Tailscale                   │
│  Backups: /srv/uneti/backups → NAS u otro nodo (cifrado)               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. Requisitos

| Recurso | Mínimo | Recomendado |
|---|---|---|
| vCPU | 2 | 4 |
| RAM | 4 GB | 8 GB |
| Disco | 40 GB | 100 GB SSD |
| Red | IP fija o DHCP reservado | VLAN institucional + IP pública |
| Dominio | — | `www.dominio` y `cms.dominio` |
| Puertos públicos | 80, 443 | 80, 443 |
| Puertos internos | 3000, 8080 | 3000, 8080 (solo loopback) |
| Base de datos | 3306 | 3306 (sin publicar) |

Software en la VM:

- Debian 13 (o 12) de 64 bits.
- Docker Engine 28.x y Compose ≥ 2.24 (ruta A).
- Node.js 26.13.0 LTS (ruta B o C).
- PHP 8.5 con Apache 2.4 o Nginx + PHP-FPM (ruta B).
- MariaDB 11.8 (ruta B).
- Python 3.10+ (solo para `scripts/seed/seed.py` en la ruta A).
- Caddy 2 o Nginx + certbot.
- Tailscale (acceso administrativo).

---

## 2. Usuarios, claves y secretos

### 2.1 Inventario

| Usuario / clave | Dónde se usa | Quién lo usa | Generación |
|---|---|---|---|
| `root` (Proxmox) | Consola del hipervisor | Administrador de virtualización | Definido al instalar Proxmox |
| `operador` | VM Debian, con `sudo` | Ingeniero de despliegue | `adduser operador` |
| Clave SSH `id_ed25519` | Acceso a la VM y a Proxmox | Operador | `ssh-keygen -t ed25519 -a 100` |
| `MYSQL_ROOT_PASSWORD` | MariaDB | Solo tareas administrativas | `openssl rand -base64 32` |
| `MYSQL_USER` (`wp_user`) | WordPress → MariaDB | WordPress | Nombre fijo |
| `MYSQL_PASSWORD` | WordPress → MariaDB | WordPress | `openssl rand -base64 32` |
| `WP_ADMIN_USER` | Panel de WordPress | Contenido y administración | Nombre no adivinable |
| `WP_ADMIN_PASSWORD` | Panel de WordPress | Contenido y administración | `openssl rand -base64 24` |
| `WP_ADMIN_EMAIL` | Panel de WordPress | Notificaciones | Correo institucional |
| `UNETI_FORM_TOKEN` | Next.js ⇄ WordPress (solicitudes) | Servicios | `openssl rand -hex 32` |
| `UNETI_REVALIDATE_TOKEN` | Next.js (`/api/revalidar`) | Servicios / webhook | `openssl rand -hex 32` |
| Correo ACME | Caddy / Let's Encrypt | Proxy | `admin@dominio` |
| Auth key de Tailscale | Unir la VM a la tailnet | Operador | Panel de Tailscale |
| Clave `age` | Cifrado de backups | Operador | `age-keygen -o /root/age.key` |
| Token de GitHub | Clonar el repositorio privado | Operador | Fine-grained PAT (solo lectura) |

### 2.2 Generación y resguardo

```bash
# Usuario de operación y clave SSH
adduser operador
usermod -aG sudo operador
ssh-keygen -t ed25519 -a 100 -C "operador@uneti-prod"
ssh-copy-id -i ~/.ssh/id_ed25519.pub operador@<IP_VM>

# Secretos de aplicación
openssl rand -base64 32   # MYSQL_ROOT_PASSWORD
openssl rand -base64 32   # MYSQL_PASSWORD
openssl rand -base64 24   # WP_ADMIN_PASSWORD
openssl rand -hex 32      # UNETI_FORM_TOKEN
openssl rand -hex 32      # UNETI_REVALIDATE_TOKEN

# Clave de backups
age-keygen -o /root/age.key
chmod 600 /root/age.key
```

Reglas:

1. Nunca escribir secretos en el repositorio, en capturas ni en el chat.
2. `.env` y `/etc/uneti/*.env` con permisos `600` y propietario del servicio.
3. Rotar los tokens si el repositorio se compartió o hubo un incidente.
4. Guardar una copia cifrada de las claves en el gestor institucional.
5. Separar los secretos de **staging** y **producción**.

---

## 3. Preparación de Proxmox

### 3.1 Crear la VM

Desde la interfaz: **Create VM** → Debian 13, 4 vCPU, 8 GB RAM, disco 100 GB, red en el puente institucional, SSH habilitado.

Equivalente por consola (ajusta IDs, almacenamiento y puente):

```bash
qm create 210 --name uneti-prod --memory 8192 --cores 4 --sockets 1 \
  --net0 virtio,bridge=vmbr0,tag=10 \
  --scsihw virtio-scsi-pci --scsi0 local-lvm:100 \
  --ide2 local:iso/debian-13-netinst.iso,media=cdrom \
  --boot order=scsi0 --ostype l26 --agent enabled=1
qm start 210
```

### 3.2 Red y DNS

```bash
ip -4 addr show
ip route
cat /etc/resolv.conf
ping -c 3 1.1.1.1
curl -I https://deb.debian.org
```

Fija la IP en `/etc/network/interfaces` o con `nmcli` antes de continuar.

### 3.3 Snapshot y respaldo del hipervisor

Antes de instalar nada:

```bash
qm snapshot 210 antes-de-instalar-docker
vzdump 210 --storage backup --mode snapshot --compress zstd
```

Programa `vzdump` diario desde *Datacenter → Backup* con retención de 7 diarios y 4 semanales.

---

## 4. Endurecimiento de la VM

```bash
# 1. Usuario y SSH
adduser operador && usermod -aG sudo operador
sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# 2. Actualizaciones y utilidades
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y ufw fail2ban unattended-upgrades curl ca-certificates gnupg lsb-release age rsync

# 3. Zona horaria
sudo timedatectl set-timezone America/Caracas

# 4. Firewall (Tailscale primero)
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --ssh --advertise-tags=tag:uneti-prod
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow in on tailscale0
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status verbose
```

> El orden importa: si cierras el puerto 22 antes de conectar Tailscale, pierdes el acceso.

En **Proxmox → Datacenter → Firewall**, política de entrada `DROP` y reglas: `22` solo desde la subred de administración o Tailscale, `8006` solo LAN/Tailscale, `80` y `443` desde cualquier origen.

---

## 5. Ruta A — Docker Compose (recomendada)

### 5.1 Instalar Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker operador
newgrp docker
docker version
docker compose version
```

### 5.2 Estructura y código

```bash
sudo mkdir -p /srv/uneti/{app,data/db,data/wp,backups,secrets}
sudo chown -R operador:operador /srv/uneti

# Repositorio privado: usa un token de solo lectura
git clone https://<TOKEN>@github.com/IVasquezRui/SD-UNETI.git /srv/uneti/app
cd /srv/uneti/app
git checkout main
```

### 5.3 Archivo `.env` de producción

```bash
cp .env.example .env
chmod 600 .env
nano .env
```

| Variable | Valor de producción |
|---|---|
| `COMPOSE_PROJECT_NAME` | `uneti-prod` |
| `MYSQL_ROOT_PASSWORD` | Secreto generado |
| `MYSQL_DATABASE` | `wordpress_db` |
| `MYSQL_USER` | `wp_user` |
| `MYSQL_PASSWORD` | Secreto generado |
| `DB_DATA_DIR` | `/srv/uneti/data/db` |
| `WP_DATA_DIR` | `/srv/uneti/data/wp` |
| `WORDPRESS_URL` | `https://cms.dominio` |
| `SITE_URL` | `https://www.dominio` |
| `WORDPRESS_TITLE` | `UNETI` |
| `WORDPRESS_ADMIN_USER` | Usuario no adivinable |
| `WORDPRESS_ADMIN_PASSWORD` | Secreto generado |
| `WORDPRESS_ADMIN_EMAIL` | Correo institucional |
| `UNETI_FORM_TOKEN` | Secreto generado |
| `UNETI_REVALIDATE_TOKEN` | Secreto distinto |
| `WP_FORCE_SSL` | `1` |
| `FRONTEND_PORT` / `WORDPRESS_PORT` | `3000` / `8080` |

### 5.4 Build inmutable del frontend

Crea `frontend/Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:26.13.0-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:26.13.0-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:26.13.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000
RUN groupadd --system uneti && useradd --system --gid uneti --create-home uneti
COPY --from=build --chown=uneti:uneti /app/.next ./.next
COPY --from=build --chown=uneti:uneti /app/public ./public
COPY --from=build --chown=uneti:uneti /app/package.json ./package.json
COPY --from=build --chown=uneti:uneti /app/next.config.ts ./next.config.ts
COPY --from=build --chown=uneti:uneti /app/node_modules ./node_modules
USER uneti
EXPOSE 3000
CMD ["npm", "run", "start"]
```

> `NEXT_PUBLIC_SITE_URL` se inlinea en el build: debe pasarse como `--build-arg` o como `args` del compose.

### 5.5 Compose de producción

Crea `deploy/compose.prod.yml` (no reutilices `docker-compose.prod.yml`, que pertenece al CI):

```yaml
name: uneti-prod

services:
  db:
    image: ${MARIADB_IMAGE}
    restart: unless-stopped
    command: ["--local-infile=0", "--skip-name-resolve"]
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MARIADB_ROOT_HOST: localhost
    volumes:
      - /srv/uneti/data/db:/var/lib/mysql
      - ../scripts/database/endurecer.sql:/docker-entrypoint-initdb.d/zz-uneti-endurecer.sql:ro
    healthcheck:
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 12
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }

  wordpress:
    image: ${WORDPRESS_IMAGE}
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    ports: ["127.0.0.1:8080:80"]
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_USER: ${MYSQL_USER}
      WORDPRESS_DB_PASSWORD: ${MYSQL_PASSWORD}
      WORDPRESS_DB_NAME: ${MYSQL_DATABASE}
      UNETI_FORM_TOKEN: ${UNETI_FORM_TOKEN}
      WP_FORCE_SSL: "1"
      WORDPRESS_CONFIG_EXTRA: |
        define( 'WP_HOME', '${WORDPRESS_URL}' );
        define( 'WP_SITEURL', '${WORDPRESS_URL}' );
        define( 'WP_MEMORY_LIMIT', '512M' );
        define( 'DISALLOW_FILE_EDIT', true );
        define( 'DISABLE_WP_CRON', true );
        define( 'FS_METHOD', 'direct' );
        if ( isset( $_SERVER['HTTP_X_FORWARDED_PROTO'] ) && 'https' === $_SERVER['HTTP_X_FORWARDED_PROTO'] ) {
            $_SERVER['HTTPS'] = 'on';
        }
    volumes:
      - /srv/uneti/data/wp:/var/www/html
      - ../scripts/wordpress/mu-plugins:/var/www/html/wp-content/mu-plugins:ro
      - ../scripts/wordpress/apache/seguridad.conf:/etc/apache2/conf-enabled/zz-uneti-seguridad.conf:ro
      - ../scripts/wordpress/php/seguridad.ini:/usr/local/etc/php/conf.d/zz-uneti-seguridad.ini:ro
      - ../wp_content/plugins/wp-graphql:/var/www/html/wp-content/plugins/wp-graphql:ro
      - ../scripts/wordpress:/opt/uneti-scripts:ro
    healthcheck:
      test: ["CMD-SHELL", "curl -fsS http://127.0.0.1/wp-login.php > /dev/null || exit 1"]
      interval: 15s
      timeout: 5s
      retries: 10
      start_period: 40s
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }

  frontend:
    build:
      context: ../frontend
      args:
        NEXT_PUBLIC_SITE_URL: ${SITE_URL}
    image: uneti-frontend:${UNETI_VERSION:-v1.0.0}
    restart: unless-stopped
    depends_on:
      wordpress: { condition: service_started }
    ports: ["127.0.0.1:3000:3000"]
    environment:
      NEXT_PUBLIC_SITE_URL: ${SITE_URL}
      WP_INTERNAL_URL: http://wordpress
      WP_GRAPHQL_URL: http://wordpress/graphql
      WP_FORM_TOKEN: ${UNETI_FORM_TOKEN}
      UNETI_REVALIDATE_TOKEN: ${UNETI_REVALIDATE_TOKEN}
    security_opt: ["no-new-privileges:true"]
    pids_limit: 512
    read_only: true
    tmpfs: ["/tmp", "/app/.next/cache"]
    logging: { driver: json-file, options: { max-size: "10m", max-file: "3" } }
```

### 5.6 Levantar y sembrar

```bash
cd /srv/uneti/app
COMPOSE="docker compose --env-file .env -f deploy/compose.prod.yml"

$COMPOSE build
$COMPOSE up -d
$COMPOSE ps

# Instala WordPress, activa WPGraphQL, importa el seed y verifica
python3 scripts/seed/seed.py bootstrap --project uneti-prod --service wordpress
python3 scripts/seed/seed.py verify   --project uneti-prod --service wordpress
```

---

## 6. Ruta B — Instalación nativa en la VM

Úsala solo si Docker no está permitido. WordPress queda en `/var/www/html` porque `bootstrap.php`, `importar.php` y `verify.php` resuelven esa ruta.

### 6.1 Paquetes base

```bash
# Node.js 26 LTS
curl -fsSL https://deb.nodesource.com/setup_26.x | sudo -E bash -
sudo apt install -y nodejs
node -v          # v26.13.0
npm -v

# PHP 8.5 (repositorio Sury)
sudo apt install -y apt-transport-https lsb-release ca-certificates curl
sudo curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg
echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" \
  | sudo tee /etc/apt/sources.list.d/sury-php.list
sudo apt update
sudo apt install -y apache2 php8.5 php8.5-cli php8.5-mysql php8.5-curl php8.5-gd \
  php8.5-mbstring php8.5-xml php8.5-zip php8.5-intl libapache2-mod-php8.5
sudo a2enmod rewrite headers expires
sudo systemctl restart apache2

# MariaDB 11.8
curl -LsS https://r.mariadb.com/downloads/mariadb_repo_setup \
  | sudo bash -s -- --mariadb-server-version=11.8
sudo apt install -y mariadb-server
sudo mariadb-secure-installation
```

### 6.2 Base de datos

```bash
sudo mariadb -u root <<'SQL'
CREATE DATABASE IF NOT EXISTS wordpress_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'wp_user'@'localhost' IDENTIFIED BY 'CAMBIAR_MYSQL_PASSWORD';
GRANT ALL PRIVILEGES ON wordpress_db.* TO 'wp_user'@'localhost';
FLUSH PRIVILEGES;
SQL

sudo mariadb -u root -e "SELECT User, Host FROM mysql.user WHERE User='';"
sudo mariadb -u root -e "SHOW VARIABLES LIKE 'local_infile';"
```

### 6.3 Código y WordPress

```bash
sudo mkdir -p /srv/uneti /opt/uneti-scripts
sudo chown -R operador:operador /srv/uneti
git clone https://<TOKEN>@github.com/IVasquezRui/SD-UNETI.git /srv/uneti/app
cd /srv/uneti/app

# WordPress 7.1.4
cd /tmp
curl -fsSLO https://wordpress.org/wordpress-7.1.4.tar.gz
tar -xzf wordpress-7.1.4.tar.gz
sudo rsync -a /tmp/wordpress/ /var/www/html/

# WPGraphQL versionado, mu-plugins y scripts operativos
sudo cp -r /srv/uneti/app/wp_content/plugins/wp-graphql /var/www/html/wp-content/plugins/
sudo mkdir -p /var/www/html/wp-content/mu-plugins
sudo rsync -a /srv/uneti/app/scripts/wordpress/mu-plugins/ /var/www/html/wp-content/mu-plugins/
sudo rsync -a /srv/uneti/app/scripts/wordpress/ /opt/uneti-scripts/

# Endurecimiento de Apache y PHP
sudo cp /srv/uneti/app/scripts/wordpress/apache/seguridad.conf /etc/apache2/conf-available/uneti-seguridad.conf
sudo a2enconf uneti-seguridad
sudo cp /srv/uneti/app/scripts/wordpress/php/seguridad.ini /etc/php/8.5/apache2/conf.d/99-uneti.ini
sudo cp /srv/uneti/app/scripts/wordpress/php/seguridad.ini /etc/php/8.5/cli/conf.d/99-uneti.ini

# Propietario y permisos
sudo chown -R www-data:www-data /var/www/html
sudo find /var/www/html -type d -exec chmod 755 {} \;
sudo find /var/www/html -type f -exec chmod 644 {} \;
```

`wp-config.php` (a partir de `wp-config-sample.php`):

```bash
sudo -u www-data cp /var/www/html/wp-config-sample.php /var/www/html/wp-config.php
sudo -u www-data nano /var/www/html/wp-config.php
```

Valores que deben quedar:

```php
define( 'DB_NAME', 'wordpress_db' );
define( 'DB_USER', 'wp_user' );
define( 'DB_PASSWORD', 'CAMBIAR_MYSQL_PASSWORD' );
define( 'DB_HOST', 'localhost' );
define( 'DB_CHARSET', 'utf8mb4' );

define( 'WP_HOME', 'https://cms.dominio' );
define( 'WP_SITEURL', 'https://cms.dominio' );
define( 'DISALLOW_FILE_EDIT', true );
define( 'DISABLE_WP_CRON', true );
define( 'FS_METHOD', 'direct' );
define( 'WP_DEBUG', false );
define( 'FORCE_SSL_ADMIN', true );
```

Las sales se copian desde `https://api.wordpress.org/secret-key/1.1/salt/` en el bloque `AUTH_KEY` … `NONCE_SALT`.

### 6.4 Apache en loopback

```bash
# Escucha solo en loopback; Caddy publica al exterior
echo "Listen 127.0.0.1:8080" | sudo tee /etc/apache2/conf-available/uneti-listen.conf
sudo a2enconf uneti-listen

sudo tee /etc/apache2/sites-available/uneti.conf >/dev/null <<'APACHE'
<VirtualHost 127.0.0.1:8080>
    ServerName cms.dominio
    DocumentRoot /var/www/html

    <Directory /var/www/html>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    ErrorLog  ${APACHE_LOG_DIR}/uneti-wp-error.log
    CustomLog ${APACHE_LOG_DIR}/uneti-wp-access.log combined
</VirtualHost>
APACHE

sudo a2dissite 000-default
sudo a2ensite uneti
sudo apache2ctl configtest
sudo systemctl restart apache2
curl -I http://127.0.0.1:8080/wp-login.php
```

### 6.5 Frontend Next.js con systemd

```bash
sudo useradd --system --create-home --home-dir /opt/uneti --shell /usr/sbin/nologin uneti
sudo chown -R uneti:uneti /srv/uneti/app/frontend

cd /srv/uneti/app/frontend
sudo -u uneti npm ci --no-audit --no-fund
sudo -u uneti env NEXT_PUBLIC_SITE_URL="https://www.dominio" npm run build

sudo mkdir -p /etc/uneti
sudo tee /etc/uneti/frontend.env >/dev/null <<'ENV'
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://www.dominio
WP_INTERNAL_URL=http://127.0.0.1:8080
WP_GRAPHQL_URL=http://127.0.0.1:8080/graphql
WP_FORM_TOKEN=CAMBIAR_UNETI_FORM_TOKEN
UNETI_REVALIDATE_TOKEN=CAMBIAR_UNETI_REVALIDATE_TOKEN
ENV
sudo chmod 600 /etc/uneti/frontend.env
sudo chown uneti:uneti /etc/uneti/frontend.env

sudo tee /etc/systemd/system/uneti-frontend.service >/dev/null <<'UNIT'
[Unit]
Description=Portal UNETI (Next.js)
After=network.target mariadb.service apache2.service
Wants=mariadb.service apache2.service

[Service]
Type=simple
User=uneti
Group=uneti
WorkingDirectory=/srv/uneti/app/frontend
EnvironmentFile=/etc/uneti/frontend.env
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT

sudo systemctl daemon-reload
sudo systemctl enable --now uneti-frontend
sudo systemctl status uneti-frontend --no-pager
curl -I http://127.0.0.1:3000
```

### 6.6 Seed y cron en nativo

```bash
# Copia del seed al contenedor temporal que esperan los scripts
sudo rm -rf /tmp/uneti-seed-import
sudo cp -r /srv/uneti/app/seed /tmp/uneti-seed-import
sudo chown -R www-data:www-data /tmp/uneti-seed-import

# Instalación de WordPress (solo si la base está vacía)
sudo -u www-data php /opt/uneti-scripts/bootstrap.php \
  --title=UNETI \
  --admin-user=CAMBIAR_USUARIO \
  --admin-password=CAMBIAR_CLAVE \
  --admin-email=admin@dominio

# Importación idempotente y verificación
sudo -u www-data php /opt/uneti-scripts/seed/importar.php --input=/tmp/uneti-seed-import
sudo -u www-data php /opt/uneti-scripts/seed/verify.php   --input=/tmp/uneti-seed-import
```

Cron de WordPress (el `DISABLE_WP_CRON` de `wp-config.php` lo exige):

```bash
echo "*/10 * * * * www-data curl -s -H 'Host: cms.dominio' 'http://127.0.0.1:8080/wp-cron.php?doing_wp_cron' >/dev/null 2>&1" \
  | sudo tee /etc/cron.d/uneti-wp
sudo chmod 644 /etc/cron.d/uneti-wp
```

---

## 7. Ruta C — Despliegue híbrido

Útil cuando se quiere WordPress en Docker (por comodidad y versionado) y Next.js nativo (por rendimiento o por política de la casa).

```bash
# WordPress + MariaDB en Docker, publicados solo en loopback
cd /srv/uneti/app
docker compose --env-file .env -f deploy/compose.prod.yml up -d db wordpress
curl -I http://127.0.0.1:8080/wp-login.php

# Next.js nativo apuntando al WordPress containerizado
cd /srv/uneti/app/frontend
sudo -u uneti env NEXT_PUBLIC_SITE_URL="https://www.dominio" npm run build
sudo systemctl restart uneti-frontend
```

En `/etc/uneti/frontend.env` usa `WP_INTERNAL_URL=http://127.0.0.1:8080` y `WP_GRAPHQL_URL=http://127.0.0.1:8080/graphql` (no `http://wordpress`, porque el proceso Next no está en la red de Docker).

El seed se ejecuta con `seed.py` porque WordPress sigue en Docker:

```bash
python3 scripts/seed/seed.py bootstrap --project uneti-prod --service wordpress
```

---

## 8. DNS, TLS y proxy inverso

### 8.1 DNS

| Registro | Tipo | Valor | TTL |
|---|---|---|---|
| `www.dominio` | A / AAAA | IP pública de la VM | 300 |
| `cms.dominio` | A / AAAA | IP pública de la VM | 300 |
| `dominio` | A / AAAA | IP pública de la VM | 300 |

Comprueba la propagación antes de pedir el certificado:

```bash
dig +short www.dominio
dig +short cms.dominio
```

### 8.2 Caddy (recomendado)

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' \
  | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' \
  | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

`/etc/caddy/Caddyfile`:

```caddyfile
{
    email admin@dominio
    admin off
}

dominio {
    redir https://www.dominio{uri} permanent
}

www.dominio {
    encode zstd gzip
    header {
        -Server
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
    }
    reverse_proxy 127.0.0.1:3000
}

cms.dominio {
    encode zstd gzip
    header -Server

    # Único contenido público del CMS: imágenes de noticias
    @uploads path /wp-content/uploads/*
    handle @uploads {
        reverse_proxy 127.0.0.1:8080
    }

    # Administración, REST, GraphQL y activos del panel: solo por Tailscale
    @interno {
        path /wp-admin/* /wp-login.php /wp-json/* /graphql /xmlrpc.php /wp-includes/* /wp-content/plugins/* /wp-content/mu-plugins/*
        remote_ip 100.64.0.0/10
    }
    handle @interno {
        reverse_proxy 127.0.0.1:8080
    }

    handle {
        respond 404
    }
}
```

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo journalctl -u caddy -f       # emisión del certificado
curl -I https://www.dominio
```

### 8.3 Nginx + certbot (alternativa)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

`/etc/nginx/sites-available/uneti`:

```nginx
server {
    listen 80;
    server_name www.dominio dominio;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name cms.dominio;

    location /wp-content/uploads/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
    }

    location / {
        allow 100.64.0.0/10;
        deny all;
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/uneti /etc/nginx/sites-enabled/uneti
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d www.dominio -d dominio -d cms.dominio
```

---

## 9. Seed y contenido

### 9.1 Comandos por ruta

| Acción | Ruta A / C (Docker) | Ruta B (nativo) |
|---|---|---|
| Validar fixtures | `python3 scripts/seed/seed.py validate` | `python3 scripts/seed/seed.py validate` |
| Instalar + importar + verificar | `seed.py bootstrap` | `bootstrap.php` + `importar.php` + `verify.php` |
| Importar | `seed.py import` | `php /opt/uneti-scripts/seed/importar.php --input=/tmp/uneti-seed-import` |
| Verificar | `seed.py verify` | `php /opt/uneti-scripts/seed/verify.php --input=/tmp/uneti-seed-import` |
| Exportar el CMS actual | `seed.py export` | `php /opt/uneti-scripts/seed/export.php --output=/tmp/uneti-seed-export` |
| Regenerar originales | `seed.py import --refresh-media` | `importar.php --input=... --refresh-media` |

### 9.2 Reglas de idempotencia

- Los posts se reconocen por `_uneti_seed_key` y, si no existe, por slug.
- Los adjuntos se reconocen por `_uneti_seed_archivo` o por nombre de archivo.
- Los comentarios se reconocen por `_uneti_seed_key` o por autor + contenido.
- Una segunda importación no duplica nada; `--prune` elimina lo marcado que ya no está en los fixtures.

### 9.3 Exportar antes de cada release

```bash
# Ruta A
python3 scripts/seed/seed.py export
git -C /srv/uneti/app diff --stat seed/

# Ruta B
sudo rm -rf /tmp/uneti-seed-export
sudo -u www-data php /opt/uneti-scripts/seed/export.php --output=/tmp/uneti-seed-export
sudo rsync -a /tmp/uneti-seed-export/ /srv/uneti/app/seed/
```

Verifica que el export no contenga usuarios reales, hashes, sesiones, IPs ni correos personales antes de versionarlo.

---

## 10. Verificación

### 10.1 Rutas públicas

```bash
BASE=https://www.dominio
for r in / /nosotros /carreras /carreras/pnf-informatica /carreras/pnf-telecomunicaciones \
         /posgrados /cursos /admisiones /contacto /noticias /privacidad; do
  printf '%-45s %s\n' "$r" "$(curl -s -o /dev/null -w '%{http_code}' "$BASE$r")"
done

# Redirecciones heredadas
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/news"
curl -s -o /dev/null -w '%{http_code}\n' "$BASE/courses"
```

### 10.2 Cabeceras y seguridad

```bash
curl -sI https://www.dominio | grep -Ei 'strict-transport|content-security|x-frame|referrer|permissions'
curl -s -o /dev/null -w '%{http_code}\n' https://cms.dominio/wp-admin/       # 404 desde fuera de Tailscale
curl -s -o /dev/null -w '%{http_code}\n' https://cms.dominio/graphql         # 404 desde fuera de Tailscale
curl -s -o /dev/null -w '%{http_code}\n' https://www.dominio/.env            # 404
```

### 10.3 QA funcional y pentests

```bash
cd /srv/uneti/app
bash scripts/ci/qa-frontend.sh https://www.dominio
node scripts/ci/probar-formulario.mjs
bash scripts/ci/pentest-nextjs.sh https://www.dominio
bash scripts/ci/pentest-wordpress.sh
bash scripts/ci/pentest-mariadb.sh
```

### 10.4 Base de datos y WordPress

```bash
# Ruta A
COMPOSE="docker compose --env-file .env -f deploy/compose.prod.yml"
$COMPOSE exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" -e "SELECT COUNT(*) FROM wordpress_db.wp_posts WHERE post_type='solicitud_uneti';"
$COMPOSE exec -T wordpress wp post list --post_type=solicitud_uneti --fields=ID,post_title,post_status

# Ruta B
sudo mariadb -u root -e "SELECT COUNT(*) FROM wordpress_db.wp_posts WHERE post_type='solicitud_uneti';"
sudo -u www-data php /var/www/html/wp-cli.phar post list --post_type=solicitud_uneti --fields=ID,post_title,post_status 2>/dev/null || true
```

### 10.5 Criterios de aceptación

- Las 11 rutas responden 200 y las heredadas responden 301.
- `/api/noticias` devuelve 6 noticias.
- Los tres formularios generan folio y se ven en `wp-admin`.
- Los comentarios quedan pendientes de aprobación.
- `wp-admin`, `/graphql` y `/wp-json` no son accesibles desde Internet.
- `security.txt`, `robots.txt`, `sitemap.xml` y `/privacidad` publicados.
- Los pentests terminan en `POSITIVO (0 brechas)`.

---

## 11. Backups y restauración

### 11.1 Script para la ruta Docker

```bash
sudo tee /srv/uneti/secrets/backup.env >/dev/null <<'ENV'
MYSQL_ROOT_PASSWORD=CAMBIAR
AGE_RECIPIENT=age1xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ENV
sudo chmod 600 /srv/uneti/secrets/backup.env

sudo tee /srv/uneti/backup.sh >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail

RAIZ=/srv/uneti
FECHA=$(date +%F-%H%M)
DESTINO="$RAIZ/backups"
COMPOSE=(docker compose --env-file "$RAIZ/app/.env" -f "$RAIZ/app/deploy/compose.prod.yml")
source "$RAIZ/secrets/backup.env"

mkdir -p "$DESTINO"

"${COMPOSE[@]}" exec -T db sh -c \
  'exec mariadb-dump --single-transaction --quick --routines --triggers \
   -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  | gzip -9 > "$DESTINO/db-$FECHA.sql.gz"

tar -C "$RAIZ/data" -czf "$DESTINO/wp-$FECHA.tar.gz" wp

age -r "$AGE_RECIPIENT" -o "$DESTINO/db-$FECHA.sql.gz.age" "$DESTINO/db-$FECHA.sql.gz"
age -r "$AGE_RECIPIENT" -o "$DESTINO/wp-$FECHA.tar.gz.age"  "$DESTINO/wp-$FECHA.tar.gz"
rm -f "$DESTINO/db-$FECHA.sql.gz" "$DESTINO/wp-$FECHA.tar.gz"

find "$DESTINO" -name '*.age' -mtime +14 -delete
rsync -a --delete "$DESTINO/" backup@nas.dominio:/backups/sd-uneti/
SH

sudo chmod 700 /srv/uneti/backup.sh
sudo crontab -l 2>/dev/null | { cat; echo "30 3 * * * /srv/uneti/backup.sh >> /var/log/uneti-backup.log 2>&1"; } | sudo crontab -
```

### 11.2 Script para la ruta nativa

```bash
sudo tee /srv/uneti/backup-native.sh >/dev/null <<'SH'
#!/usr/bin/env bash
set -euo pipefail

RAIZ=/srv/uneti
FECHA=$(date +%F-%H%M)
DESTINO="$RAIZ/backups"
source "$RAIZ/secrets/backup.env"

mkdir -p "$DESTINO"

mariadb-dump --single-transaction --quick --routines --triggers \
  -u root -p"$MYSQL_ROOT_PASSWORD" wordpress_db | gzip -9 > "$DESTINO/db-$FECHA.sql.gz"

tar -czf "$DESTINO/wp-$FECHA.tar.gz" -C /var/www/html .

age -r "$AGE_RECIPIENT" -o "$DESTINO/db-$FECHA.sql.gz.age" "$DESTINO/db-$FECHA.sql.gz"
age -r "$AGE_RECIPIENT" -o "$DESTINO/wp-$FECHA.tar.gz.age"  "$DESTINO/wp-$FECHA.tar.gz"
rm -f "$DESTINO/db-$FECHA.sql.gz" "$DESTINO/wp-$FECHA.tar.gz"

find "$DESTINO" -name '*.age' -mtime +14 -delete
rsync -a --delete "$DESTINO/" backup@nas.dominio:/backups/sd-uneti/
SH
sudo chmod 700 /srv/uneti/backup-native.sh
```

### 11.3 Prueba de restauración (trimestral, en staging)

```bash
# Docker
age -d -i /root/age.key -o /tmp/db.sql.gz /srv/uneti/backups/db-2026-11-11-0330.sql.gz.age
gunzip -c /tmp/db.sql.gz | docker compose --env-file .env -f deploy/compose.prod.yml \
  exec -T db mariadb -uroot -p"$MYSQL_ROOT_PASSWORD" wordpress_db

# Nativo
age -d -i /root/age.key -o /tmp/db.sql.gz /srv/uneti/backups/db-2026-11-11-0330.sql.gz.age
gunzip -c /tmp/db.sql.gz | sudo mariadb -u root -p wordpress_db
```

Registra fecha, responsable, archivo restaurado y resultado. **Un backup que no se restaura no es un backup.**

### 11.4 Respaldo del hipervisor

```bash
vzdump 210 --storage backup --mode snapshot --compress zstd --prune-backups keep-daily=7,keep-weekly=4,keep-monthly=12
```

---

## 12. Monitoreo y logs

```bash
docker run -d --name uptime-kuma --restart unless-stopped \
  -p 127.0.0.1:3001:3001 -v /srv/uneti/uptime:/app/data louislam/uptime-kuma:1
```

| Monitor | Umbral |
|---|---|
| `https://www.dominio/` | 200 en menos de 2 s |
| `https://www.dominio/api/noticias` | 200 y palabra clave |
| `https://cms.dominio/wp-content/uploads/…` | 200 en un archivo conocido |
| Certificado TLS | Aviso a 14 días |

Alertas por correo institucional y Telegram. Además:

```bash
# Salud de contenedores
docker compose --env-file .env -f deploy/compose.prod.yml ps

# Logs recientes
docker compose --env-file .env -f deploy/compose.prod.yml logs --since 24h --tail 200
journalctl -u caddy --since "24 hours ago"
journalctl -u uneti-frontend --since "24 hours ago"

# Disco
df -h /
du -sh /srv/uneti/data/*

# Intentos de acceso
sudo journalctl -u ssh --since "1 hour ago" | grep -i failed
```

Alertas mínimas: disco al 80 %, certificado a 14 días, caída de la portada y error 5xx repetido.

---

## 13. Go-live y rollback

### 13.1 Checklist de salida

- [ ] DNS de `www`, `cms` y el dominio raíz resuelve correctamente (A/AAAA).
- [ ] Certificado emitido y renovación automática verificada.
- [ ] HTTP redirige a HTTPS y HSTS presente.
- [ ] `3000`, `8080`, `3306` y `8006` no accesibles desde Internet.
- [ ] `wp-admin`, `/graphql` y `/wp-json` responden 404 fuera de Tailscale.
- [ ] Las 11 rutas responden 200 y las heredadas 301.
- [ ] Las imágenes de noticias cargan desde `cms.dominio`.
- [ ] Los tres formularios crean folio y se ven en `wp-admin`.
- [ ] Los comentarios quedan pendientes de aprobación.
- [ ] `robots.txt`, `sitemap.xml`, `security.txt` y `/privacidad` publicados.
- [ ] Backup ejecutado y restauración probada en staging.
- [ ] Monitoreo en verde y alertas de prueba recibidas.
- [ ] `LICENSE` y `NOTICE` presentes; créditos de imágenes completos.
- [ ] Acta de aceptación con responsable y fecha.

### 13.2 Congelar la versión

```bash
cd /srv/uneti/app
git fetch --tags
git tag -a v1.0.0-prod -m "Despliegue producción UNETI $(date +%F)"
git push origin v1.0.0-prod
export UNETI_VERSION=v1.0.0-prod
```

### 13.3 Rollback

| Escenario | Acción |
|---|---|
| Solo frontend | `UNETI_VERSION=<anterior> docker compose ... up -d --no-deps frontend` |
| Contenido dañado | Restaurar `wp_data` y el dump previos |
| Fallo total | Restaurar el snapshot de Proxmox `antes-de-instalar-docker` |
| DNS | Bajar el TTL a 60 s antes del corte para revertir en minutos |

```bash
# Ejemplo de rollback de frontend en Docker
cd /srv/uneti/app
UNETI_VERSION=v0.9.0 docker compose --env-file .env -f deploy/compose.prod.yml up -d --no-deps frontend
```

### 13.4 Primeros 30 días

- Rotar todos los secretos que existieron en desarrollo.
- Ejecutar WPScan, Nuclei y los pentests contra el dominio real.
- Revisar intentos de acceso a `wp-login.php` y `xmlrpc.php`.
- Medir Lighthouse móvil y registrar la línea base.
- Programar la primera prueba de restauración y la revisión de accesibilidad.
- Congelar cambios de infraestructura la primera semana salvo incidentes.

---

## 14. Mantenimiento

| Tarea | Frecuencia | Comando / referencia |
|---|---|---|
| Actualizar WordPress y plugins | Mensual | Panel de WordPress o `wp core update` |
| Actualizar WPGraphQL | Con cada release | Se versiona en `wp_content/plugins/wp-graphql`; actualizar en el repo y desplegar |
| Actualizar dependencias del frontend | Mensual | `npm audit`, `npm outdated`, PR a `develop` |
| Rotar `UNETI_FORM_TOKEN` | Trimestral o ante incidente | Actualizar `.env` y reiniciar frontend y WordPress |
| Rotar claves de base de datos | Anual | `ALTER USER` + `.env` + reinicio |
| Revisar backups | Mensual | Verificar tamaño, fecha y última restauración |
| Revisar certificados | Mensual | `caddy` renueva solo; confirmar en logs |
| Parches del sistema | Semanal | `unattended-upgrades` + ventana mensual |
| Revisión de accesos | Trimestral | Usuarios de WordPress, Tailscale y SSH |

Ventana recomendada: martes o miércoles, 22:00–00:00 (America/Caracas), con snapshot previo y rollback probado.

---

## 15. Anexos

### 15.1 Puertos

| Puerto | Servicio | Exposición correcta |
|---|---|---|
| `22` | SSH | Solo Tailscale o VLAN de administración |
| `80` | Proxy (redirección) | Internet |
| `443` | Proxy (TLS) | Internet |
| `3000` | Next.js | `127.0.0.1` |
| `8080` | WordPress / Apache | `127.0.0.1` |
| `3306` | MariaDB | Sin publicar |
| `8006` | Proxmox VE | LAN / Tailscale |
| `3001` | Uptime Kuma | Tailscale |

### 15.2 Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `COMPOSE_PROJECT_NAME` | Sí | Nombre del proyecto Compose (`uneti-prod`) |
| `MYSQL_ROOT_PASSWORD` | Sí | Contraseña de root de MariaDB |
| `MYSQL_DATABASE` | Sí | `wordpress_db` |
| `MYSQL_USER` | Sí | `wp_user` |
| `MYSQL_PASSWORD` | Sí | Contraseña de `wp_user` |
| `DB_DATA_DIR` / `WP_DATA_DIR` | Sí | Rutas absolutas de persistencia |
| `WORDPRESS_URL` | Sí | URL pública del CMS (`https://cms.dominio`) |
| `SITE_URL` / `NEXT_PUBLIC_SITE_URL` | Sí | URL pública del portal (`https://www.dominio`) |
| `WORDPRESS_TITLE` | No | Título del sitio |
| `WORDPRESS_ADMIN_USER` | Sí | Usuario administrador de WordPress |
| `WORDPRESS_ADMIN_PASSWORD` | Sí | Contraseña del administrador |
| `WORDPRESS_ADMIN_EMAIL` | Sí | Correo del administrador |
| `UNETI_FORM_TOKEN` | Sí | Token Next.js ⇄ WordPress |
| `UNETI_REVALIDATE_TOKEN` | Sí | Token del webhook `/api/revalidar` |
| `WP_FORM_TOKEN` | Sí | Mismo valor que `UNETI_FORM_TOKEN` en el frontend |
| `WP_INTERNAL_URL` / `WP_GRAPHQL_URL` | Sí | `http://wordpress` (Docker) o `http://127.0.0.1:8080` (nativo) |
| `WP_FORCE_SSL` | Sí | `1` en producción |
| `MARIADB_IMAGE` / `WORDPRESS_IMAGE` / `NODE_IMAGE` | No | Etiquetas fijas para reproducibilidad |

### 15.3 Rutas de referencia

| Elemento | Docker | Nativo |
|---|---|---|
| Código | `/srv/uneti/app` | `/srv/uneti/app` |
| WordPress | `/srv/uneti/data/wp` | `/var/www/html` |
| Base de datos | `/srv/uneti/data/db` | `/var/lib/mysql` |
| Backups | `/srv/uneti/backups` | `/srv/uneti/backups` |
| Scripts operativos | `/opt/uneti-scripts` (volumen) | `/opt/uneti-scripts` |
| Configuración del frontend | `.env` | `/etc/uneti/frontend.env` |
| Proxy | `/etc/caddy/Caddyfile` | `/etc/caddy/Caddyfile` |

### 15.4 Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `502 Bad Gateway` en el portal | Next.js caído o mal puerto | `systemctl status uneti-frontend` / `docker compose ps`; revisar `PORT` |
| Bucle de redirección en `wp-admin` | `WP_HOME` en `http://` detrás de TLS | Corregir `WORDPRESS_URL` a `https://` y `X-Forwarded-Proto` |
| GraphQL devuelve `null` | WPGraphQL no activo o no montado | Verificar `wp plugin list` y el volumen `wp-content/plugins/wp-graphql` |
| Imágenes 404 | `wp-content/uploads` no público en el proxy | Permitir `/wp-content/uploads/*` en Caddy/Nginx |
| Formulario responde 503 | `WP_FORM_TOKEN` vacío o distinto | Igualar `UNETI_FORM_TOKEN` y `WP_FORM_TOKEN` |
| Formulario responde 403 | `Origin` no permitido | Revisar `NEXT_PUBLIC_SITE_URL` y el host de la petición |
| Cambios de WordPress no se ven | ISR en caché | `POST /api/revalidar` con el token |
| `seed.py` no encuentra el servicio | Proyecto Compose distinto | Usar `--project uneti-prod` y el mismo `name:` del compose |
| Permisos en `uploads` | Propietario incorrecto | `chown -R www-data:www-data /var/www/html/wp-content` |
| Certificado no emitido | DNS sin propagar o puerto 80 cerrado | `dig`, abrir 80/443 y revisar `journalctl -u caddy` |
| Correos de WordPress no llegan | Sin SMTP | Instalar SMTP institucional o desactivar notificaciones |
| Cron de WordPress no corre | `DISABLE_WP_CRON` sin cron del sistema | Crear el timer o el `/etc/cron.d/uneti-wp` |

### 15.5 Registro de la ejecución

| Fecha | Responsable | Ruta elegida | Versión desplegada | Resultado | Observaciones |
|---|---|---|---|---|---|
| | | A / B / C | | | |

---

**Fin de la guía.** Cualquier desviación debe registrarse en el control de cambios del proyecto y reflejarse en este documento antes del siguiente despliegue.










