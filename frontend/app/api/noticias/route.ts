import { connection, NextResponse } from "next/server";
import { obtenerNoticiasEnVivo } from "../../lib/noticias";

export async function GET() {
  await connection();
  const noticias = await obtenerNoticiasEnVivo(50);
  return NextResponse.json(noticias, {
    headers: { "Cache-Control": "no-store" },
  });
}
