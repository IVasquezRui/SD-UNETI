// Prueba el formulario de admisiones de punta a punta contra Next.js y WordPress.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

function cargarEnv() {
  try {
    for (const linea of readFileSync(".env", "utf8").split("\n")) {
      const coincidencia = linea.match(/^([A-Z0-9_]+)=(.*)$/);
      if (coincidencia && !process.env[coincidencia[1]]) {
        process.env[coincidencia[1]] = coincidencia[2].trim();
      }
    }
  } catch {
    // Sin .env se usan los valores por defecto de CI.
  }
}

cargarEnv();

const BASE = (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const WP = (process.env.WP_URL ?? "http://localhost:8080").replace(/\/$/, "");
const TOKEN = process.env.UNETI_FORM_TOKEN ?? "ci-form-token";
const REPORTE = "reportes/formulario.md";

mkdirSync("reportes", { recursive: true });

const lineas = [`# Prueba del formulario de admisiones`, "", `Fecha: ${new Date().toISOString()}`, ""];
let fallos = 0;

function ok(mensaje) {
  console.log(`[POSITIVO] ${mensaje}`);
  lineas.push(`- [POSITIVO] ${mensaje}`);
}

function fallo(mensaje) {
  fallos += 1;
  console.log(`[NEGATIVO] ${mensaje}`);
  lineas.push(`- [NEGATIVO] ${mensaje}`);
}

function payload(extra = {}) {
  return {
    tipo: "admision",
    nombre: "Formulario CI",
    cedula: "12345678",
    correo: "formulario-ci@example.com",
    telefono: "0212-505-1402",
    programa: "PNF en Informática",
    mensaje: "Solicitud de prueba automatizada.",
    consentimiento: true,
    origen: `${BASE}/admisiones`,
    inicio: Date.now() - 5000,
    sitio_web: "",
    ...extra,
  };
}

async function pedir(url, opciones = {}) {
  try {
    const respuesta = await fetch(url, {
      ...opciones,
      signal: AbortSignal.timeout(15000),
    });
    const texto = await respuesta.text();
    return { status: respuesta.status, texto };
  } catch (error) {
    return { status: 0, texto: String(error) };
  }
}

function json(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

async function postNext(datos, origen = BASE) {
  return pedir(`${BASE}/api/admisiones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: origen,
    },
    body: JSON.stringify(datos),
  });
}

async function postWp(datos, token = TOKEN) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["X-UNETI-Token"] = token;

  return pedir(`${WP}/wp-json/uneti/v1/solicitudes`, {
    method: "POST",
    headers,
    body: JSON.stringify(datos),
  });
}

// 1. Envío válido por Next.js
const valido = await postNext(payload());
const cuerpoValido = json(valido.texto);
const folio = cuerpoValido?.folio ?? "";

if (valido.status === 201 && folio) {
  ok(`El formulario creó la solicitud en WordPress (folio ${folio})`);
  writeFileSync("reportes/folio.txt", folio);
} else {
  fallo(`El envío válido respondió ${valido.status} y folio "${folio}"`);
}

// 2. Correo inválido
const invalido = await postNext(payload({ correo: "correo-invalido" }));
if (invalido.status === 400) {
  ok("El correo inválido se rechaza con 400");
} else {
  fallo(`El correo inválido respondió ${invalido.status} (se esperaba 400)`);
}

// 3. Honeypot
const honeypot = await postNext(payload({ sitio_web: "bot" }));
const cuerpoHoneypot = json(honeypot.texto);
if (honeypot.status === 201 && cuerpoHoneypot?.folio === null) {
  ok("El honeypot recibe un éxito falso sin crear una solicitud");
} else {
  fallo(`El honeypot respondió ${honeypot.status} (se esperaba 201 con folio null)`);
}

// 4. Origen no permitido
const origen = await postNext(payload(), "https://sitio-no-autorizado.example");
if (origen.status === 403) {
  ok("Un Origin distinto al sitio público se rechaza con 403");
} else {
  fallo(`El Origin no autorizado respondió ${origen.status}`);
}

// 5. Método no permitido
const metodo = await pedir(`${BASE}/api/admisiones`);
if (metodo.status === 405) {
  ok("GET /api/admisiones responde 405");
} else {
  fallo(`GET /api/admisiones respondió ${metodo.status}`);
}

// 6. Límite de intentos (se ejecuta al final para no bloquear las pruebas anteriores)
let bloqueos = 0;
for (let intento = 0; intento < 8; intento += 1) {
  const respuesta = await postNext(payload({ correo: "limite-invalido" }));
  if (respuesta.status === 429) bloqueos += 1;
}

if (bloqueos > 0) {
  ok("El límite de intentos devuelve 429");
} else {
  fallo("El límite de intentos no devolvió 429");
}

// 7. WordPress directo: sin token y con token
const sinToken = await postWp(payload(), "");
if (sinToken.status === 403) {
  ok("WordPress rechaza el POST directo sin token (403)");
} else {
  fallo(`WordPress sin token respondió ${sinToken.status}`);
}

const wpMetodo = await pedir(`${WP}/wp-json/uneti/v1/solicitudes`);
if (wpMetodo.status === 405) {
  ok("WordPress rechaza GET /solicitudes (405)");
} else {
  fallo(`WordPress GET /solicitudes respondió ${wpMetodo.status}`);
}

const wpValido = await postWp(payload({ correo: "wp-directo-ci@example.com" }));
const cuerpoWp = json(wpValido.texto);
if (wpValido.status === 201 && cuerpoWp?.folio) {
  ok(`WordPress guarda una solicitud directa (folio ${cuerpoWp.folio})`);
} else {
  fallo(`WordPress directo respondió ${wpValido.status}`);
}

lineas.push("", fallos === 0 ? "**RESULTADO GENERAL: POSITIVO**" : `**RESULTADO GENERAL: NEGATIVO (${fallos})**`, "");
writeFileSync(REPORTE, lineas.join("\n"));

console.log("");
console.log(
  fallos === 0
    ? "RESULTADO GENERAL: POSITIVO (0 brechas)"
    : `RESULTADO GENERAL: NEGATIVO (${fallos} brechas)`,
);

process.exit(fallos === 0 ? 0 : 1);
