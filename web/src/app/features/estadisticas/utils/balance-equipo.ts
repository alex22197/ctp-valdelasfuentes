import type { PartidoEquipo } from '@data-access/estadisticas/interfaces/partido-equipo.interface';
import type { FilaBalance } from '@shared/utils/graficas/interfaces/fila-balance.interface';

function fila(
  nombre: string,
  partidos: readonly PartidoEquipo[],
  cumple: (partido: PartidoEquipo) => boolean,
): FilaBalance {
  const suyos = partidos.filter(cumple);
  return {
    nombre,
    ganados: suyos.filter((p) => p.ganado).length,
    perdidos: suyos.filter((p) => !p.ganado).length,
  };
}

/** Partidos ganados y perdidos jugando en casa y fuera. Los WO cuentan: son del equipo. */
export function balanceCasaFuera(partidos: readonly PartidoEquipo[]): FilaBalance[] {
  return [
    fila('En casa', partidos, (p) => p.condicion === 'local'),
    fila('Fuera', partidos, (p) => p.condicion === 'visitante'),
  ];
}

/** Partidos ganados y perdidos en cada categoría. */
export function balancePorCategoria(partidos: readonly PartidoEquipo[]): FilaBalance[] {
  return [
    fila('Masculino', partidos, (p) => p.tipo === 'masculino'),
    fila('Femenino', partidos, (p) => p.tipo === 'femenino'),
    fila('Mixto', partidos, (p) => p.tipo === 'mixto'),
  ];
}

/**
 * Cómo se deciden los partidos: los que se cierran en dos sets, los que llegan al tercero y,
 * aparte, los tie-breaks (sets 7-6) ganados y perdidos. Sin los WO, que no tienen sets.
 */
export function partidosAjustados(partidos: readonly PartidoEquipo[]): FilaBalance[] {
  const jugados = partidos.filter((p) => !p.esWo);
  const tiebreaks = jugados.reduce(
    (total, p) => ({
      ganados: total.ganados + p.tiebreaksGanados,
      perdidos: total.perdidos + p.tiebreaksJugados - p.tiebreaksGanados,
    }),
    { ganados: 0, perdidos: 0 },
  );
  return [
    fila('En dos sets', jugados, (p) => p.setsJugados === 2),
    fila('A tres sets', jugados, (p) => p.setsJugados === 3),
    { nombre: 'Tie-breaks', ...tiebreaks },
  ];
}
