import { obtenerNoticias } from "../lib/noticias";
import SeccionNoticiasEnVivo from "./SeccionNoticiasEnVivo";

/**
 * Listado completo de noticias en su propio componente para que el `await`
 * quede dentro del límite de `<Suspense>` y no bloquee el shell de `/noticias`.
 */
export default async function ListadoNoticias({ limite = 50 }: { limite?: number }) {
  const noticias = await obtenerNoticias(limite);

  return <SeccionNoticiasEnVivo noticiasIniciales={noticias} />;
}
