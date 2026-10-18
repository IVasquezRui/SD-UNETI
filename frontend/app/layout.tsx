import type { Metadata } from "next";
import "./globals.css";
import TemplateScripts from "./components/TemplateScripts";

export const metadata: Metadata = {
  title: "UNETI | Universidad Nacional Experimental de las Telecomunicaciones e Informática",
  description:
    "Sitio oficial de la UNETI: formación gratuita en telecomunicaciones, informática y tecnologías emergentes. PNF en Telecomunicaciones y PNF en Informática.",
  icons: { icon: "/assets/images/uneti/favicon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="no-js" lang="es">
      <head>
        {/* Hojas de estilo del template demo-elearning (mismo orden de cascada que el HTML original) */}
        <link rel="stylesheet" href="/assets/css/vendors.min.css" />
        <link rel="stylesheet" href="/assets/css/icon.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
        <link rel="stylesheet" href="/assets/css/responsive.css" />
        <link rel="stylesheet" href="/assets/css/elearning.css" />
        <link rel="stylesheet" href="/assets/css/uneti.css" />
      </head>
      <body
        data-mobile-nav-trigger-alignment="right"
        data-mobile-nav-style="modern"
        data-mobile-nav-bg-color="#0f2239"
      >
        {children}
        <TemplateScripts />
      </body>
    </html>
  );
}

