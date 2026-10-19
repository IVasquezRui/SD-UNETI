"use client";

import { useEffect, useMemo, useState } from "react";
import type { Noticia } from "../lib/noticias";

/**
 * Mantiene el listado sincronizado con WordPress.
 * SSE entrega snapshots cuando cambia el hash de noticias; el polling cada 30 s
 * cubre reconexiones y navegadores que bloquean EventSource.
 */
export function useNoticiasEnVivo(noticiasIniciales: Noticia[], limite?: number) {
  const [noticias, setNoticias] = useState<Noticia[]>(noticiasIniciales);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let eventSource: EventSource | null = null;
    let reintento: ReturnType<typeof setTimeout> | null = null;

    const reemplazar = (datos: unknown) => {
      if (!Array.isArray(datos)) return;
      setNoticias(datos as Noticia[]);
    };

    const conectar = () => {
      if (cancelado) return;

      eventSource = new EventSource("/api/noticias/stream");

      eventSource.onopen = () => setConectado(true);
      eventSource.onmessage = (evento) => {
        try {
          reemplazar(JSON.parse(evento.data));
        } catch {
          // Un evento incompleto no debe romper la lista ya renderizada.
        }
      };
      eventSource.onerror = () => {
        setConectado(false);
        eventSource?.close();
        if (!cancelado) {
          reintento = setTimeout(conectar, 5000);
        }
      };
    };

    const respaldo = window.setInterval(async () => {
      try {
        const respuesta = await fetch("/api/noticias", { cache: "no-store" });
        if (respuesta.ok) {
          reemplazar(await respuesta.json());
          setConectado(true);
        }
      } catch {
        // El siguiente ciclo reintenta.
      }
    }, 30000);

    conectar();

    return () => {
      cancelado = true;
      window.clearInterval(respaldo);
      if (reintento) clearTimeout(reintento);
      eventSource?.close();
    };
  }, []);

  const visibles = useMemo(
    () => (typeof limite === "number" ? noticias.slice(0, limite) : noticias),
    [noticias, limite],
  );

  return { noticias: visibles, conectado };
}
