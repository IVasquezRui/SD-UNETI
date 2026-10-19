import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: "/about", destination: "/nosotros", statusCode: 301 },
      { source: "/admissions", destination: "/admisiones", statusCode: 301 },
      { source: "/contact", destination: "/contacto", statusCode: 301 },
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
