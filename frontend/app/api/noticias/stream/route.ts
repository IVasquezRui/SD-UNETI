import { connection } from "next/server";
import { obtenerNoticiasEnVivo } from "../../../lib/noticias";

const INTERVALO_MS = 15000;
const encoder = new TextEncoder();

function huella(noticias: Awaited<ReturnType<typeof obtenerNoticiasEnVivo>>): string {
  return JSON.stringify(
    noticias.map((noticia) => [
      noticia.slug,
      noticia.titulo,
      noticia.fechaISO,
      noticia.comentarios,
      noticia.imagen,
      noticia.resumen,
      noticia.contenidoHtml,
    ]),
  );
}

export async function GET(request: Request) {
  await connection();

  let intervalo: ReturnType<typeof setInterval> | null = null;
  let cerrado = false;

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      let ultimaHuella = "";
      let consultando = false;

      const emitir = async () => {
        if (cerrado || consultando) return;
        consultando = true;

        try {
          const noticias = await obtenerNoticiasEnVivo(50);
          if (cerrado) return;

          const actual = huella(noticias);
          if (actual === ultimaHuella) return;
          ultimaHuella = actual;

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(noticias)}\n\n`));
        } catch {
          cerrado = true;
          if (intervalo) clearInterval(intervalo);
        } finally {
          consultando = false;
        }
      };

      const cerrar = () => {
        if (cerrado) return;
        cerrado = true;
        if (intervalo) clearInterval(intervalo);
        try {
          controller.close();
        } catch {
          // El cliente ya cerró la conexión.
        }
      };

      if (request.signal.aborted) {
        cerrar();
        return;
      }

      request.signal.addEventListener("abort", cerrar, { once: true });

      controller.enqueue(encoder.encode(": conectado a UNETI noticias\n\n"));
      void emitir();
      intervalo = setInterval(() => void emitir(), INTERVALO_MS);
    },
    cancel() {
      cerrado = true;
      if (intervalo) clearInterval(intervalo);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
