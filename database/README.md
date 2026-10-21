# Base de datos

Este directorio ya no contiene un dump SQL.

La base se crea vacía con las variables `MYSQL_DATABASE`, `MYSQL_USER` y
`MYSQL_PASSWORD` de `docker-compose.yml` / `.env`. El contenido institucional
se reconstruye con el seed portable versionado en `seed/`:

```bash
cp .env.example .env
docker compose up -d
python3 scripts/seed/seed.py bootstrap
```

## Por qué no se versiona un dump

- Un dump incluye usuarios, hashes de contraseña, sesiones, correos e IPs.
- No es legible en revisiones ni se puede fusionar.
- Queda desactualizado respecto al código y a los fixtures.
- El seed usa las APIs de WordPress y mantiene serializaciones, miniaturas,
  términos y contadores correctos.

Si necesitas un respaldo operativo de una instalación concreta, guárdalo fuera
del repositorio y trátalo como material sensible.
