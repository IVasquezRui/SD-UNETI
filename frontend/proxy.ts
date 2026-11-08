import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const METODOS_PERMITIDOS = "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS";

/**
 * Bloquea TRACE/TRACK (Cross-Site Tracing) y deja pasar el resto de peticiones.
 * Next.js no rechaza estos métodos por sí mismo.
 */
export default function proxy(request: NextRequest) {
  if (request.method === "TRACE" || request.method === "TRACK") {
    return new NextResponse(null, {
      status: 405,
      headers: { Allow: METODOS_PERMITIDOS },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
