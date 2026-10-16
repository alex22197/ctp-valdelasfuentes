import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import { describirFechaConfrontacion } from '@shared/utils/fechas';

/**
 * La nota bajo la clasificación: cuándo la actualizó la liga por última vez o, si nunca lo ha
 * hecho (todo a cero), que aún no hay datos. Sin promesas de fechas fijas: la web de la liga
 * no siempre se actualiza.
 */
export function describirActualizacion(
  filas: readonly Pick<FilaClasificacion, 'actualizadaEn'>[],
): string {
  const ultima = filas
    .map((fila) => fila.actualizadaEn)
    .filter((fecha): fecha is string => fecha !== null)
    .sort()
    .at(-1);
  if (!ultima) {
    return 'La liga todavía no ha publicado la clasificación de esta fase: de momento sale a cero.';
  }
  const cuando = describirFechaConfrontacion(ultima, null);
  return `Datos oficiales de la web de la liga, actualizados el ${cuando.charAt(0).toLowerCase()}${cuando.slice(1)}.`;
}
