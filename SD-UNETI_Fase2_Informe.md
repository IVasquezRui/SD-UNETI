# Informe de Fase 2 - SD-UNETI

**Autor:** Iván Vásquez - Tech Leader del proyecto SD-UNETI

---

## 1. Resumen ejecutivo

Estoy liderando la Fase 2 del proyecto SD-UNETI: conectar el backend WordPress con el frontend Next.js. La misión es usar GraphQL como canal principal de datos, pero en esta etapa se logró una integración funcional con un fallback a la API REST de WordPress.

### Estado actual

- Meta estratégica: comunicación GraphQL.
- Resultado pragmático: comunicación funcional usando REST cuando GraphQL no entrega la página.
- Página validada: `beta_sduneti`.

---

## 2. Objetivo de la Fase 2

1. Habilitar WordPress como CMS headless.
2. Conectar Next.js al contenido de WordPress.
3. Priorizar WPGraphQL como método de comunicación.
4. Garantizar una ruta de respaldo estable con la API REST.

---

## 3. Problemas identificados

### 3.1. GraphQL no retornaba la página esperada

- WordPress devolvía `page: null` para la página `beta_sduneti` cuando se consultaba a través de GraphQL.
- La consulta inicial usaba `idType: SLUG`, que no era compatible con la versión de WPGraphQL en el proyecto.
- Se concluyó que la búsqueda correcta era por `URI` y no por `SLUG`.

### 3.2. Host interno vs. host público

- Internamente, en el contenedor `frontend`, el backend correcto es `http://wordpress/graphql`.
- Externamente, desde el navegador, debía usarse `http://wp.uneti.local/graphql`.
- Esta diferencia generó confusiones en el enrutamiento y en el acceso a la API.

### 3.3. Proxy inverso y dominio local

- El proyecto usa `Nginx Proxy Manager` para exponer el frontend en `netx.uneti.local`.
- Fue necesario detener y arrancar el proxy para validar los cambios.
- La ruta del proxy debía enrutar bien hacia el frontend y también respetar el acceso a WordPress.

### 3.4. Next.js App Router y parámetros dinámicos

- En Next.js 16, `params` en rutas dinámicas puede ser una promesa.
- El componente `app/[slug]/page.tsx` accedía directamente a `params.slug`, provocando errores de renderizado.
- Esto devolvía un error de la plataforma y la página no se generaba correctamente.

### 3.5. Fallback REST necesario

- La consulta GraphQL funcionó en estructura, pero no devolvió datos válidos para `beta_sduneti`.
- Para continuar con la entrega de contenido, se activó un fallback a la API REST de WordPress.
- El fallback garantizó que el contenido se recuperara y el frontend pudiera renderizar la página.

---

## 4. Soluciones aplicadas

### 4.1. Ajuste de la consulta GraphQL

- Actualicé la consulta en `frontend/src/lib/queries.ts` a:

```graphql
query GetPageBySlug($uri: ID!) {
  page(id: $uri, idType: URI) {
    id
    title
    content
  }
}
```

- La variable `uri` se construyó como `/${slug}/` para buscar la página por ruta completa.

### 4.2. Corrección de `apollo-client`

- En `frontend/src/lib/apollo-client.ts` configuré las URLs de GraphQL según el contexto:
  - SSR interno: `http://wordpress/graphql`
  - CSR público: `http://wp.uneti.local/graphql`

- Esto dejó separados correctamente los entornos interno y externo.

### 4.3. Implementación del fallback REST

- Incorporé `fetchPageRest(slug)` en `frontend/src/app/[slug]/page.tsx`.
- El flujo quedó:
  1. probar GraphQL
  2. si no devuelve datos, intentar REST
  3. si no hay datos, devolver `notFound()`

- La llamada REST se hizo a:
  - `http://wordpress/wp-json/wp/v2/pages?slug=<slug>`

### 4.4. Ajuste de la ruta dinámica en Next.js

- Cambié `page.tsx` a:

```ts
export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

- Con esto evité el error generado por el uso directo de `params.slug`.

### 4.5. Validación final a través de proxy

- Reinicié el contenedor `SD-UNETI_npm` del proxy.
- Verifiqué `http://netx.uneti.local/`.
- Confirmé que `http://netx.uneti.local/beta_sduneti` renderiza correctamente:
  - `h1`: `beta_sduneti`
  - contenido WordPress: `Universidad Nacional Experimental de las Telecomunicaciones e informática`

---

## 5. Resultado final

- La integración WordPress + Next.js está operativa.
- La página `beta_sduneti` se renderiza en el frontend.
- El canal principal sigue siendo GraphQL, pero el fallback REST garantiza continuidad en producción.

---

## 6. Lecciones clave

- La comunicación headless exige separar claramente los contextos Docker interno y la URL pública.
- WPGraphQL puede ser el objetivo, pero no debe bloquear la entrega de contenido.
- En Next.js App Router, hay que tratar `params` como una promesa en rutas dinámicas.
- Un fallback REST bien implementado es una solución válida durante la transición a GraphQL.

---

## 7. Próximos pasos

1. Reforzar el diagnóstico para que `beta_sduneti` funcione por GraphQL.
2. Confirmar que WPGraphQL expone correctamente el esquema y la página.
3. Migrar más páginas al flujo GraphQL cuando la API entregue datos válidos.
4. Mantener el fallback REST como respaldo operativo mientras se estabiliza GraphQL.
