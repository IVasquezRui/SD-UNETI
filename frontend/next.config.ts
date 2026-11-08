import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  /**
   * Perfiles de `cacheLife` para el ISR de Next 16 con Cache Components.
   * Se usan con `cacheLife("noticias")` dentro de funciones `'use cache'`.
   */
  cacheLife: {
    noticias: { stale: 60, revalidate: 300, expire: 3600 },
    contenido: { stale: 3600, revalidate: 86400, expire: 604800 },
  },
  async headers() {
    const desarrollo = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      `script-src 'self' 'unsafe-inline'${desarrollo ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: http://localhost:8080",
      "media-src 'self'",
      "worker-src 'self' blob:",
      `connect-src 'self'${desarrollo ? " ws: wss:" : ""}`,
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://maps.google.com https://www.google.com",
      "manifest-src 'self'",
    ].join("; ");

    const cabeceras = [
      { key: "Content-Security-Policy", value: csp },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "X-DNS-Prefetch-Control", value: "on" },
    ];

    if (!desarrollo) {
      cabeceras.push({
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      });
    }

    return [{ source: "/(.*)", headers: cabeceras }];
  },
  async redirects() {
    return [
      { source: "/about", destination: "/nosotros", statusCode: 301 },
      { source: "/admissions", destination: "/admisiones", statusCode: 301 },
      { source: "/contact", destination: "/contacto", statusCode: 301 },
      { source: "/contactanos", destination: "/contacto", statusCode: 301 },
      { source: "/api/contact", destination: "/api/contacto", statusCode: 301 },
      { source: "/news", destination: "/noticias", statusCode: 301 },
      { source: "/news/:slug*", destination: "/noticias/:slug*", statusCode: 301 },
      { source: "/courses", destination: "/carreras", statusCode: 301 },
      { source: "/courses/:slug*", destination: "/carreras/:slug*", statusCode: 301 },
    ];
  },
  images: {
    // Activos servidos por el backend WordPress (Docker: http://localhost:8080)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8081",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "wordpress",
        pathname: "/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
