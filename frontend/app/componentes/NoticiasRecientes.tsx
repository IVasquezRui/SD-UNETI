import { obtenerNoticias } from "../lib/noticias";
import SeccionNoticiasEnVivo from "./SeccionNoticiasEnVivo";

/**
 * Lectura de noticias en su propio componente para que el `await` quede dentro
 * del límite de `<Suspense>` y no retrase el shell estático de la portada.
 */
export default async function NoticiasRecientes({ limite = 3 }: { limite?: number }) {
  const noticias = await obtenerNoticias(limite);

  return <SeccionNoticiasEnVivo noticiasIniciales={noticias} limite={limite} />;
}
