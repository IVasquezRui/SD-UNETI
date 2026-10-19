"use client";

import { useCallback, useEffect, useState } from "react";

export type Comentario = {
  id: number;
  nombre: string;
  contenido: string;
  fechaISO: string;
  avatar: string | null;
};

type RespuestaComentarios = {
  comentarios?: Comentario[];
  comentario?: Comentario;
  error?: string;
};

export function useComentarios(slug: string) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargar = useCallback(
    async (activo: () => boolean) => {
      try {
        const respuesta = await fetch(`/api/noticias/${slug}/comentarios`, {
          cache: "no-store",
        });
        const data = (await respuesta.json()) as RespuestaComentarios;
        if (!activo()) return;
        if (!respuesta.ok) throw new Error(data.error ?? "No se pudieron cargar los comentarios.");
        setComentarios(data.comentarios ?? []);
        setError("");
      } catch (fallo) {
        if (activo()) {
          setError(fallo instanceof Error ? fallo.message : "No se pudieron cargar los comentarios.");
        }
      } finally {
        if (activo()) setCargando(false);
      }
    },
    [slug],
  );

  useEffect(() => {
    let montado = true;
    const activo = () => montado;

    const inicial = window.setTimeout(() => void cargar(activo), 0);
    const intervalo = window.setInterval(() => void cargar(activo), 20000);

    return () => {
      montado = false;
      window.clearTimeout(inicial);
      window.clearInterval(intervalo);
    };
  }, [cargar]);

  const enviarComentario = useCallback(
    async (nombre: string, correo: string, contenido: string) => {
      setEnviando(true);
      setError("");

      try {
        const respuesta = await fetch(`/api/noticias/${slug}/comentarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, correo, contenido }),
        });
        const data = (await respuesta.json()) as RespuestaComentarios;

        if (!respuesta.ok || !data.comentario) {
          throw new Error(data.error ?? "No se pudo publicar el comentario.");
        }

        setComentarios((actuales) => [data.comentario as Comentario, ...actuales]);
        return true;
      } catch (fallo) {
        setError(fallo instanceof Error ? fallo.message : "No se pudo publicar el comentario.");
        return false;
      } finally {
        setEnviando(false);
      }
    },
    [slug],
  );

  return { comentarios, cargando, error, enviando, enviarComentario };
}
