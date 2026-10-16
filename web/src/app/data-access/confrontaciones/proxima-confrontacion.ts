import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';

/** Las que aún no se han jugado. */
export const ESTADOS_POR_JUGAR: readonly EstadoConfrontacion[] = [
  'programada',
  'aplazada',
  'suspendida',
];

/**
 * Cuándo se juega, como AAAA-MM-DD en Madrid: el día real si ya hay hora; si no, el fin de
 * semana del calendario oficial. Una jornada aplazada cuya fecha ya ha pasado vuelve a estar
 * «por confirmar» (`null`) hasta que se le ponga la nueva.
 */
export function diaDeJuego(jornada: ConfrontacionNuestroEquipo, hoy: string): string | null {
  const dia = jornada.fechaHora
    ? fechaIsoEnMadrid(new Date(jornada.fechaHora))
    : jornada.fechaPrevista;
  return jornada.estado === 'aplazada' && dia !== null && dia < hoy ? null : dia;
}

/**
 * La siguiente que se juega: de las que están por jugar y no han pasado (la de hoy incluida),
 * la de fecha más cercana; las que no tienen fecha van detrás, por número de jornada. `hoy` es
 * AAAA-MM-DD en Madrid. La usan la portada y la página de gestión.
 */
export function elegirProximaConfrontacion(
  calendario: readonly ConfrontacionNuestroEquipo[],
  hoy: string,
): ConfrontacionNuestroEquipo | null {
  const candidatas = calendario
    .filter((jornada) => ESTADOS_POR_JUGAR.includes(jornada.estado))
    .map((jornada) => ({ jornada, dia: diaDeJuego(jornada, hoy) }))
    .filter(({ dia }) => dia === null || dia >= hoy);
  candidatas.sort(
    (a, b) =>
      compararDias(a.dia, b.dia) ||
      (a.jornada.jornada ?? Number.MAX_SAFE_INTEGER) -
        (b.jornada.jornada ?? Number.MAX_SAFE_INTEGER),
  );
  return candidatas[0]?.jornada ?? null;
}

/** Las fechas en orden y las desconocidas al final. */
function compararDias(a: string | null, b: string | null): number {
  if (a === b) {
    return 0;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return a < b ? -1 : 1;
}
