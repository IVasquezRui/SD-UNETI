#!/usr/bin/env python3
"""Orquestador portable del seed de contenido de UNETI.

Python no escribe en MariaDB: valida fixtures, copia archivos y ejecuta los
scripts PHP que usan las APIs nativas de WordPress.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEED_DIR = ROOT / "seed"
DOC_FILES = ("README.md", "CREDITS.md")
RESULT_MARKER = "UNETI_SEED_RESULT "
VERIFY_MARKER = "UNETI_SEED_VERIFY "
BOOTSTRAP_MARKER = "UNETI_SEED_BOOTSTRAP "
SCHEMA_VERSION = 1


class SeedError(RuntimeError):
    """Error controlado del orquestador."""


def load_env() -> None:
    """Carga .env sin sobrescribir variables ya definidas en el shell."""
    path = ROOT / ".env"
    if not path.is_file():
        return

    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


def run(
    command: list[str],
    *,
    check: bool = True,
    capture: bool = True,
) -> subprocess.CompletedProcess[str]:
    try:
        process = subprocess.run(
            command,
            cwd=ROOT,
            text=True,
            capture_output=capture,
        )
    except FileNotFoundError as exc:
        raise SeedError(
            f"No se encontró el ejecutable {command[0]!r}. ¿Está Docker instalado?"
        ) from exc

    if check and process.returncode != 0:
        detail = (process.stderr or process.stdout or "").strip()
        raise SeedError(
            f"Falló el comando ({process.returncode}): {' '.join(command)}\n{detail}"
        )

    return process


def compose(project: str | None, *arguments: str) -> list[str]:
    command = ["docker", "compose"]
    if project:
        command += ["-p", project]
    command += list(arguments)
    return command


def resolve_container(project: str | None, service: str) -> str:
    process = run(compose(project, "ps", "-q", service))
    lines = [line.strip() for line in process.stdout.splitlines() if line.strip()]
    if not lines:
        raise SeedError(
            f"El servicio {service!r} no está corriendo. Ejecuta `docker compose up -d`."
        )
    return lines[0]


def wait_for_wordpress(container: str, timeout: int = 180) -> None:
    """Espera a que el entrypoint de WordPress cree wp-config.php."""
    deadline = time.monotonic() + timeout
    announced = False

    while time.monotonic() < deadline:
        probe = run(
            [
                "docker",
                "exec",
                "-u",
                "www-data",
                container,
                "php",
                "-r",
                'exit(is_file("/var/www/html/wp-config.php") ? 0 : 1);',
            ],
            check=False,
        )
        if probe.returncode == 0:
            return

        if not announced:
            print("Esperando a que WordPress complete su arranque...")
            announced = True
        time.sleep(2)

    raise SeedError(
        "WordPress no creó /var/www/html/wp-config.php en "
        f"{timeout}s. Revisa `docker compose logs wordpress`."
    )


def exec_php(
    container: str,
    relative_script: str,
    *arguments: str,
    user: str | None = "www-data",
    check: bool = True,
) -> subprocess.CompletedProcess[str]:
    command = ["docker", "exec"]
    if user:
        command += ["-u", user]
    command += [container, "php", f"/opt/uneti-scripts/{relative_script}", *arguments]
    return run(command, check=check)


def docker_cp(source: str, destination: str) -> None:
    run(["docker", "cp", source, destination])


def prepare_container_dir(container: str, path: str) -> None:
    run(["docker", "exec", "-u", "www-data", container, "rm", "-rf", path])
    run(["docker", "exec", "-u", "www-data", container, "mkdir", "-p", path])


def cleanup_container_dir(container: str, path: str) -> None:
    run(["docker", "exec", "-u", "www-data", container, "rm", "-rf", path], check=False)


def parse_marker(
    process: subprocess.CompletedProcess[str], marker: str
) -> dict[str, object]:
    for line in reversed(process.stdout.splitlines()):
        if line.startswith(marker):
            try:
                payload = json.loads(line[len(marker) :])
            except json.JSONDecodeError as exc:
                raise SeedError(f"JSON inválido en {marker.strip()}: {exc}") from exc
            if not isinstance(payload, dict):
                raise SeedError(f"{marker.strip()} no devolvió un objeto JSON.")
            return payload

    detail = (process.stdout or "") + (process.stderr or "")
    raise SeedError(f"No se encontró {marker.strip()} en la salida de PHP.\n{detail}")


def wordpress_url() -> str:
    explicit = os.getenv("WORDPRESS_URL")
    if explicit:
        return explicit.rstrip("/")
    return f"http://localhost:{os.getenv('WORDPRESS_PORT', '8080')}"


def read_json(path: Path) -> object:
    if not path.is_file():
        raise SeedError(f"Falta el archivo {path}")
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise SeedError(f"JSON inválido en {path}: {exc}") from exc


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def ensure(condition: bool, message: str) -> None:
    if not condition:
        raise SeedError(message)


def validate_seed_dir(seed_dir: Path) -> dict[str, object]:
    """Valida estructura, referencias y checksums de los fixtures."""
    ensure(seed_dir.is_dir(), f"No existe el directorio {seed_dir}")

    manifest = read_json(seed_dir / "manifest.json")
    site = read_json(seed_dir / "site.json")
    taxonomies = read_json(seed_dir / "taxonomies.json")
    media = read_json(seed_dir / "media.json")

    ensure(isinstance(manifest, dict), "manifest.json debe ser un objeto.")
    ensure(isinstance(site, dict), "site.json debe ser un objeto.")
    ensure(isinstance(taxonomies, dict), "taxonomies.json debe ser un objeto.")
    ensure(isinstance(media, list), "media.json debe ser una lista.")
    ensure(
        manifest.get("schemaVersion") == SCHEMA_VERSION,
        f"schemaVersion esperada {SCHEMA_VERSION}, encontrada {manifest.get('schemaVersion')}",
    )
    ensure(isinstance(manifest.get("counts"), dict), "manifest.json no contiene counts.")

    for field in (
        "title",
        "description",
        "locale",
        "timezone",
        "gmtOffset",
        "dateFormat",
        "timeFormat",
        "permalinkStructure",
        "author",
        "defaultCategory",
    ):
        ensure(field in site, f"site.json no contiene {field!r}")

    author = site["author"]
    ensure(isinstance(author, dict), "site.author debe ser un objeto.")
    for field in ("login", "displayName", "email", "description", "role"):
        ensure(field in author and str(author[field]).strip(), f"site.author.{field} vacío")

    categories = taxonomies.get("categories", [])
    tags = taxonomies.get("tags", [])
    ensure(isinstance(categories, list), "taxonomies.categories debe ser una lista.")
    ensure(isinstance(tags, list), "taxonomies.tags debe ser una lista.")
    category_slugs = {str(item["slug"]) for item in categories}
    tag_slugs = {str(item["slug"]) for item in tags}
    ensure(len(category_slugs) == len(categories), "Categorías duplicadas.")
    ensure(len(tag_slugs) == len(tags), "Etiquetas duplicadas.")

    media_keys: set[str] = set()
    for item in media:
        ensure(isinstance(item, dict), "Cada elemento de media.json debe ser un objeto.")
        for field in ("key", "file", "mime", "sha256", "bytes"):
            ensure(field in item, f"media.json: falta {field!r}")
        key = str(item["key"])
        ensure(key not in media_keys, f"Clave de media duplicada: {key}")
        media_keys.add(key)

        relative = Path(str(item["file"]))
        ensure(not relative.is_absolute(), f"Ruta absoluta no permitida: {relative}")
        ensure(".." not in relative.parts, f"Ruta con .. no permitida: {relative}")
        absolute = seed_dir / "media" / relative
        ensure(absolute.is_file(), f"Falta el original {absolute}")
        ensure(
            absolute.stat().st_size == int(item["bytes"]),
            f"Tamaño distinto para {relative}",
        )
        ensure(
            re.fullmatch(r"[0-9a-f]{64}", str(item["sha256"])) is not None,
            f"SHA-256 inválido para {relative}",
        )
        ensure(sha256(absolute) == item["sha256"], f"SHA-256 no coincide para {relative}")

    post_files = sorted((seed_dir / "posts").glob("*.json"))
    ensure(post_files, "No hay fixtures en seed/posts/")
    posts = [read_json(path) for path in post_files]
    ensure(
        len(posts) == int(manifest.get("counts", {}).get("posts", -1)),
        "Conteo de posts distinto.",
    )

    post_keys: set[str] = set()
    post_slugs: set[str] = set()
    comment_keys: set[str] = set()
    comments_total = 0

    for post in posts:
        ensure(isinstance(post, dict), "Cada post debe ser un objeto.")
        for field in (
            "key",
            "slug",
            "title",
            "content",
            "status",
            "date",
            "dateGmt",
            "categories",
            "tags",
            "comments",
        ):
            ensure(field in post, f"Post sin {field!r}: {post.get('slug', '?')}")

        post_key = str(post["key"])
        slug = str(post["slug"])
        ensure(post_key not in post_keys, f"Clave de post duplicada: {post_key}")
        ensure(slug not in post_slugs, f"Slug duplicado: {slug}")
        post_keys.add(post_key)
        post_slugs.add(slug)
        ensure(post["status"] in {"publish", "draft"}, f"Estado no permitido en {slug}")

        for category in post["categories"]:
            ensure(category in category_slugs, f"Categoría desconocida en {slug}: {category}")
        for tag in post["tags"]:
            ensure(tag in tag_slugs, f"Etiqueta desconocida en {slug}: {tag}")

        featured = post.get("featuredMedia")
        ensure(
            featured is None or featured in media_keys,
            f"Media destacada desconocida en {slug}: {featured}",
        )

        local_comments: set[str] = set()
        for comment in post["comments"]:
            for field in ("key", "author", "content", "date", "dateGmt", "approved"):
                ensure(field in comment, f"Comentario sin {field!r} en {slug}")
            key = str(comment["key"])
            ensure(key not in local_comments, f"Comentario duplicado en {slug}: {key}")
            ensure(key not in comment_keys, f"Clave de comentario duplicada: {key}")
            local_comments.add(key)
            comment_keys.add(key)
            email = str(comment.get("email", ""))
            ensure(
                not email or email.endswith(("@example.com", "@example.org", "@example.net")),
                f"Correo no permitido en el fixture: {email}",
            )

        for comment in post["comments"]:
            parent = comment.get("parent")
            if parent:
                ensure(parent in local_comments, f"Comentario padre desconocido en {slug}: {parent}")
                ensure(parent != comment["key"], f"Comentario autorreferente en {slug}")

        comments_total += len(post["comments"])

    counts = manifest["counts"]
    ensure(int(counts["media"]) == len(media), "Conteo de media distinto.")
    ensure(int(counts["comments"]) == comments_total, "Conteo de comentarios distinto.")
    ensure(int(counts["categories"]) == len(categories), "Conteo de categorías distinto.")
    ensure(int(counts["tags"]) == len(tags), "Conteo de etiquetas distinto.")

    return {
        "ok": True,
        "posts": len(posts),
        "media": len(media),
        "comments": comments_total,
        "categories": len(categories),
        "tags": len(tags),
        "schemaVersion": SCHEMA_VERSION,
        "postSlugs": sorted(post_slugs),
        "mediaFiles": sorted(str(item["file"]) for item in media),
    }


def print_php_output(process: subprocess.CompletedProcess[str]) -> None:
    for line in process.stdout.splitlines():
        if line.startswith("UNETI_SEED_"):
            continue
        if line.strip():
            print(line)
    for line in process.stderr.splitlines():
        if line.strip():
            print(line, file=sys.stderr)


def export_seed(
    project: str | None,
    service: str,
    include_drafts: bool,
) -> dict[str, object]:
    container = resolve_container(project, service)
    wait_for_wordpress(container)
    temporary = f"/tmp/uneti-seed-export-{uuid.uuid4().hex}"
    local_parent = Path(tempfile.mkdtemp(prefix="uneti-seed-export-"))
    local_export = local_parent / "export"

    prepare_container_dir(container, temporary)
    try:
        arguments = [f"--output={temporary}", "--force"]
        if include_drafts:
            arguments.append("--include-drafts")

        process = exec_php(container, "seed/export.php", *arguments)
        print_php_output(process)
        parse_marker(process, RESULT_MARKER)

        docker_cp(f"{container}:{temporary}", str(local_export))
        validate_seed_dir(local_export)

        stage = ROOT / f".seed-stage-{uuid.uuid4().hex}"
        backup = ROOT / f".seed-backup-{uuid.uuid4().hex}"
        shutil.copytree(local_export, stage)
        os.chmod(stage, 0o755)

        for document in DOC_FILES:
            source = SEED_DIR / document
            if source.is_file():
                shutil.copy2(source, stage / document)

        for walk_root, walk_dirs, walk_files in os.walk(stage):
            for directory in walk_dirs:
                os.chmod(Path(walk_root) / directory, 0o755)
            for filename in walk_files:
                os.chmod(Path(walk_root) / filename, 0o644)

        if SEED_DIR.exists():
            SEED_DIR.rename(backup)

        try:
            stage.rename(SEED_DIR)
        except Exception:
            if backup.exists() and not SEED_DIR.exists():
                backup.rename(SEED_DIR)
            raise
        else:
            shutil.rmtree(backup, ignore_errors=True)

        summary = validate_seed_dir(SEED_DIR)
        print(
            "Exportación completada: "
            f"{summary['posts']} noticias, {summary['media']} imágenes, "
            f"{summary['comments']} comentarios."
        )
        return summary
    finally:
        cleanup_container_dir(container, temporary)
        shutil.rmtree(local_parent, ignore_errors=True)


def import_seed(
    project: str | None,
    service: str,
    *,
    dry_run: bool = False,
    prune: bool = False,
    refresh_media: bool = False,
    skip_existing: bool = False,
) -> dict[str, object]:
    validate_seed_dir(SEED_DIR)
    container = resolve_container(project, service)
    wait_for_wordpress(container)
    temporary = f"/tmp/uneti-seed-import-{uuid.uuid4().hex}"

    prepare_container_dir(container, temporary)
    try:
        docker_cp(str(SEED_DIR), f"{container}:{temporary}")
        input_dir = f"{temporary}/seed"
        arguments = [f"--input={input_dir}"]

        if dry_run:
            arguments.append("--dry-run")
        if prune:
            arguments.append("--prune")
        if refresh_media:
            arguments.append("--refresh-media")
        if skip_existing:
            arguments.append("--skip-existing")

        process = exec_php(container, "seed/importar.php", *arguments)
        print_php_output(process)
        return parse_marker(process, RESULT_MARKER)
    finally:
        cleanup_container_dir(container, temporary)


def bootstrap(
    project: str | None,
    service: str,
    *,
    skip_verify: bool = False,
) -> dict[str, object]:
    container = resolve_container(project, service)
    wait_for_wordpress(container)
    arguments = [
        f"--title={os.getenv('WORDPRESS_TITLE', 'UNETI')}",
        f"--admin-user={os.getenv('WORDPRESS_ADMIN_USER', 'admin')}",
        f"--admin-email={os.getenv('WORDPRESS_ADMIN_EMAIL', 'admin@example.com')}",
    ]
    password = os.getenv("WORDPRESS_ADMIN_PASSWORD", "")
    if password:
        arguments.append(f"--admin-password={password}")

    process = exec_php(container, "bootstrap.php", *arguments)
    print_php_output(process)
    result = parse_marker(process, BOOTSTRAP_MARKER)

    imported = import_seed(project, service)
    verified: dict[str, object] | None = None
    if not skip_verify:
        verified = verify_seed(project, service)

    return {
        "bootstrap": result,
        "import": imported,
        "verify": verified,
    }


def http_get(url: str) -> tuple[int | None, str, bytes]:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "uneti-seed-verify/1.0"},
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            return (
                int(response.status),
                response.headers.get("Content-Type", ""),
                response.read(512),
            )
    except urllib.error.HTTPError as exc:
        return (
            int(exc.code),
            exc.headers.get("Content-Type", "") if exc.headers else "",
            b"",
        )
    except Exception as exc:  # noqa: BLE001 - se reporta como error de verificación
        return None, str(exc), b""


def graphql_post_slugs(base_url: str) -> set[str]:
    endpoint = f"{base_url}/graphql"
    payload = {
        "query": "{ posts(first: 100, where: { status: PUBLISH }) { nodes { slug } } }"
    }
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "User-Agent": "uneti-seed-verify/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read()
    except Exception as exc:  # noqa: BLE001
        raise SeedError(f"No se pudo consultar {endpoint}: {exc}") from exc

    try:
        data = json.loads(body)
    except json.JSONDecodeError as exc:
        raise SeedError(f"GraphQL devolvió JSON inválido: {exc}") from exc

    if data.get("errors"):
        messages = " | ".join(str(item.get("message", item)) for item in data["errors"])
        raise SeedError(f"GraphQL devolvió errores: {messages}")

    nodes = data.get("data", {}).get("posts", {}).get("nodes", [])
    return {str(node.get("slug", "")) for node in nodes if node.get("slug")}


def verify_seed(
    project: str | None,
    service: str,
    *,
    no_http: bool = False,
) -> dict[str, object]:
    summary = validate_seed_dir(SEED_DIR)
    container = resolve_container(project, service)
    wait_for_wordpress(container)
    temporary = f"/tmp/uneti-seed-verify-{uuid.uuid4().hex}"

    prepare_container_dir(container, temporary)
    try:
        docker_cp(str(SEED_DIR), f"{container}:{temporary}")
        input_dir = f"{temporary}/seed"
        process = exec_php(
            container,
            "seed/verify.php",
            f"--input={input_dir}",
            check=False,
        )
        print_php_output(process)
        result = parse_marker(process, VERIFY_MARKER)
    finally:
        cleanup_container_dir(container, temporary)

    errors = [str(item) for item in result.get("errors", [])]
    if not result.get("ok") and not errors:
        errors.append("La verificación PHP devolvió ok=false.")

    http_checks: list[dict[str, object]] = []
    graphql_checked = False
    base = wordpress_url()

    if not no_http:
        for relative in summary["mediaFiles"]:
            url = f"{base}/wp-content/uploads/{urllib.parse.quote(str(relative), safe='/')}"
            status, content_type, _ = http_get(url)
            http_checks.append(
                {"file": relative, "status": status, "contentType": content_type}
            )
            if status != 200:
                errors.append(f"HTTP {status} para {url}")
            elif not content_type.lower().startswith("image/"):
                errors.append(f"Content-Type inesperado para {url}: {content_type}")

        try:
            found = graphql_post_slugs(base)
            graphql_checked = True
            missing = set(summary["postSlugs"]) - found
            if missing:
                errors.append(
                    "GraphQL no devolvió los posts: " + ", ".join(sorted(missing))
                )
        except SeedError as exc:
            errors.append(str(exc))

    if errors:
        raise SeedError("Verificación fallida:\n- " + "\n- ".join(errors))

    result = dict(result)
    result["http"] = http_checks
    result["graphql"] = graphql_checked
    print(
        "Verificación completada: "
        f"{summary['posts']} noticias, {summary['media']} imágenes, "
        f"{summary['comments']} comentarios."
    )
    return result


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Exporta, importa y verifica el seed portable de UNETI."
    )
    parser.add_argument(
        "--project",
        default=os.getenv("COMPOSE_PROJECT_NAME") or None,
        help="Nombre del proyecto Docker Compose (default: COMPOSE_PROJECT_NAME).",
    )
    parser.add_argument(
        "--service",
        default=os.getenv("WORDPRESS_SERVICE", "wordpress"),
        help="Servicio de WordPress en docker compose (default: wordpress).",
    )

    subparsers = parser.add_subparsers(dest="command", required=True)

    export_parser = subparsers.add_parser("export", help="Exporta WordPress a seed/.")
    export_parser.add_argument(
        "--include-drafts",
        action="store_true",
        help="Incluye borradores además de las noticias publicadas.",
    )

    import_parser = subparsers.add_parser("import", help="Importa seed/ en WordPress.")
    import_parser.add_argument("--dry-run", action="store_true", help="Valida sin escribir.")
    import_parser.add_argument("--prune", action="store_true", help="Elimina objetos seed ausentes.")
    import_parser.add_argument(
        "--refresh-media",
        action="store_true",
        help="Sobrescribe originales y regenera metadatos.",
    )
    import_parser.add_argument(
        "--skip-existing",
        action="store_true",
        help="No actualiza posts que ya existen.",
    )

    bootstrap_parser = subparsers.add_parser(
        "bootstrap",
        help="Instala WordPress, activa WPGraphQL, importa y verifica.",
    )
    bootstrap_parser.add_argument(
        "--skip-verify",
        action="store_true",
        help="No ejecuta la verificación HTTP/GraphQL al final.",
    )

    verify_parser = subparsers.add_parser(
        "verify",
        help="Comprueba WordPress, GraphQL, comentarios e imágenes.",
    )
    verify_parser.add_argument(
        "--no-http",
        action="store_true",
        help="Omite las comprobaciones HTTP y GraphQL.",
    )

    subparsers.add_parser("validate", help="Valida seed/ sin usar Docker.")

    return parser


def main() -> int:
    load_env()
    parser = build_parser()
    arguments = parser.parse_args()

    try:
        if arguments.command == "validate":
            summary = validate_seed_dir(SEED_DIR)
            print(json.dumps(summary, ensure_ascii=False, indent=2))
            return 0

        if arguments.command == "export":
            summary = export_seed(
                arguments.project,
                arguments.service,
                arguments.include_drafts,
            )
            print(json.dumps(summary, ensure_ascii=False, indent=2))
            return 0

        if arguments.command == "import":
            result = import_seed(
                arguments.project,
                arguments.service,
                dry_run=arguments.dry_run,
                prune=arguments.prune,
                refresh_media=arguments.refresh_media,
                skip_existing=arguments.skip_existing,
            )
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0

        if arguments.command == "bootstrap":
            result = bootstrap(
                arguments.project,
                arguments.service,
                skip_verify=arguments.skip_verify,
            )
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0

        if arguments.command == "verify":
            result = verify_seed(
                arguments.project,
                arguments.service,
                no_http=arguments.no_http,
            )
            print(json.dumps(result, ensure_ascii=False, indent=2))
            return 0

        parser.error(f"Comando desconocido: {arguments.command}")
        return 2
    except SeedError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        print("Interrumpido.", file=sys.stderr)
        return 130


if __name__ == "__main__":
    sys.exit(main())
