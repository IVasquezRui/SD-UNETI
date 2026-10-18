import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // El template demo-elearning usa <img> con atributos propios (data-at2x); no se migra a next/image
  // para no perder el comportamiento de los assets estáticos copiados en /public.
  {
    rules: {
      "@next/next/no-img-element": "off",
      // El runtime jQuery del template (main.js) muta el DOM y clona #navbarNav.
      // La navegación interna usa <a> para forzar recarga completa y reinicializar
      // swipers, partículas y contadores en cada documento.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Assets copiados del template: JS de terceros minificado, no se lintea.
    "public/assets/**",
  ]),
]);

export default eslintConfig;
