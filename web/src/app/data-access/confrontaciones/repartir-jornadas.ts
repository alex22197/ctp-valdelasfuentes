import { estaPorJugar } from './estado-jornada';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { JornadasRepartidas } from './interfaces/jornadas-repartidas.interface';
import { diaDeJuego } from './proxima-confrontacion';

/**
 * Separa las jornadas en lo que viene y lo que ya pasó, cada parte en el orden en que se lee:
 * por jugar, de la más cercana a la más lejana (sin fecha, al final); disputadas, de la más
 * reciente a la más antigua. Una por jugar cuyo día ya pasó cuenta como disputada: solo le
 * falta el resultado. `hoy` es AAAA-MM-DD en Madrid.
 */
export function repartirJornadas(
  confrontaciones: readonly ConfrontacionNuestroEquipo[],
  hoy: string,
): JornadasRepartidas {
  const conDia = confrontaciones.map((jornada) => ({ jornada, dia: diaDeJuego(jornada) }));
  const pendiente = ({ jornada, dia }: (typeof conDia)[number]): boolean =>
    estaPorJugar(jornada.estado) && (dia === null || dia >= hoy);
  const numero = (jornada: ConfrontacionNuestroEquipo): number => jornada.jornada ?? 0;

  return {
    porJugar: conDia
      .filter(pendiente)
      .sort((a, b) => compararDias(a.dia, b.dia) || numero(a.jornada) - numero(b.jornada))
      .map(({ jornada }) => jornada),
    disputadas: conDia
      .filter((fila) => !pendiente(fila))
      .sort((a, b) => compararDias(b.dia, a.dia, -1) || numero(b.jornada) - numero(a.jornada))
      .map(({ jornada }) => jornada),
  };
}

/** Las fechas en orden; las desconocidas al final (`sinFecha` = 1) o al principio (−1). */
function compararDias(a: string | null, b: string | null, sinFecha: 1 | -1 = 1): number {
  if (a === b) {
    return 0;
  }
  if (a === null) {
    return sinFecha;
  }
  if (b === null) {
    return -sinFecha;
  }
  return a < b ? -1 : 1;
}
