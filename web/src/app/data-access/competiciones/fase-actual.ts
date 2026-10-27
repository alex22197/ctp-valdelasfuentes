import type { Fase } from './interfaces/fase.interface';
import type { TipoFase } from './interfaces/tipo-fase.type';

/** Las fases que son una liga con clasificación; el resto son eliminatorias. */
const TIPOS_CON_CLASIFICACION: readonly TipoFase[] = ['apertura', 'clausura'];

/**
 * Elige la fase en curso (`hoyIso` va en formato AAAA-MM-DD):
 * - la última que ha empezado y no ha acabado (sin `fin`, no acaba hasta que empieza otra);
 * - si la última que empezó ya acabó, la siguiente, aunque todavía no haya empezado: así
 *   entre la apertura y los retos la web ya enseña el reto;
 * - si ninguna ha empezado, la primera.
 */
export function elegirFaseActual(fases: readonly Fase[], hoyIso: string): Fase | null {
  const ordenadas = [...fases].sort((a, b) => a.orden - b.orden);
  const empezadas = ordenadas.filter((fase) => fase.inicio !== null && fase.inicio <= hoyIso);
  const ultima = empezadas.at(-1);
  if (!ultima) {
    return ordenadas[0] ?? null;
  }
  if (ultima.fin !== null && ultima.fin < hoyIso) {
    return ordenadas.find((fase) => fase.orden > ultima.orden) ?? ultima;
  }
  return ultima;
}

/**
 * La fase cuya clasificación toca enseñar: la actual si es una liga; si es una eliminatoria
 * (retos, play-off…), la última liga anterior. `null` si no hay ninguna.
 */
export function elegirFaseConClasificacion(fases: readonly Fase[], actual: Fase): Fase | null {
  if (TIPOS_CON_CLASIFICACION.includes(actual.tipo)) {
    return actual;
  }
  return (
    [...fases]
      .filter((fase) => fase.orden < actual.orden && TIPOS_CON_CLASIFICACION.includes(fase.tipo))
      .sort((a, b) => b.orden - a.orden)[0] ?? null
  );
}
