"use client";

import { useEffect } from "react";

const SCRIPTS = [
  "/assets/js/jquery.js",
  "/assets/js/vendors.min.js",
  "/assets/js/main.js",
];

// El bootstrap de Crafto (main.js) es jQuery-based: inicializa swipers, contadores,
// partículas y header al evaluarse, por lo que debe cargarse en orden y una sola vez.
let requested = false;

export default function ScriptsPlantilla() {
  useEffect(() => {
    if (requested) return;
    requested = true;

    const load = (index: number) => {
      if (index >= SCRIPTS.length) return;
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = SCRIPTS[index];
      script.onload = () => load(index + 1);
      document.body.appendChild(script);
    };

    load(0);
  }, []);

  return null;
}
