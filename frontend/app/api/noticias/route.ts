import { connection, NextResponse } from "next/server";
import { obtenerNoticias } from "../../lib/noticias";

export async function GET() {
  await connection();
  const noticias = await obtenerNoticias(50, 0);
  return NextResponse.json(noticias, {
    headers: { "Cache-Control": "no-store" },
  });
}
