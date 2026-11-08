import { connection, NextResponse } from "next/server";
import { obtenerNoticiasEnVivo } from "../../lib/noticias";
import { limitar, obtenerIp } from "../../lib/rate-limit";

export async function GET(request: Request) {
  await connection();

  const limite = limitar(`noticias:${obtenerIp(request)}`, 120, 60 * 1000);
  if (!limite.permitido) {
    return NextResponse.json(
      { ok: false, error: "Demasiadas consultas. Espera un minuto." },
      { status: 429, headers: { "Retry-After": "60", "Cache-Control": "no-store" } },
    );
  }

  const noticias = await obtenerNoticiasEnVivo(50);
  return NextResponse.json(noticias, {
    headers: { "Cache-Control": "no-store" },
  });
}
