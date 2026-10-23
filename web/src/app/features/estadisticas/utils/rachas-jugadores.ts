import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoJugadorEquipo } from '@data-access/estadisticas/interfaces/partido-jugador-equipo.interface';
import type { Racha } from '@shared/utils/interfaces/racha.interface';
import { calcularRacha } from '@shared/utils/rachas';

/**
 * La racha actual de cada jugador, por su id, con sus partidos en el orden de las jornadas.
 * Sin los WO, que no cuentan en las estadísticas de cada jugador, ni los partidos de jornadas
 * que no están en la lista (otra fase).
 */
export function rachasPorJugador(
  jornadas: readonly JornadaJugada[],
  partidos: readonly PartidoJugadorEquipo[],
): ReadonlyMap<string, Racha> {
  const orden = new Map(jornadas.map((j, indice) => [j.confrontacionId, indice]));
  const porJugador = new Map<string, { orden: number; ganado: boolean }[]>();
  for (const partido of partidos) {
    const posicion = orden.get(partido.confrontacionId);
    if (posicion === undefined || partido.esWo) {
      continue;
    }
    const lista = porJugador.get(partido.jugador.id) ?? [];
    lista.push({ orden: posicion, ganado: partido.ganado });
    porJugador.set(partido.jugador.id, lista);
  }
  const rachas = new Map<string, Racha>();
  for (const [id, lista] of porJugador) {
    const racha = calcularRacha(lista.sort((a, b) => a.orden - b.orden).map((p) => p.ganado));
    if (racha) {
      rachas.set(id, racha);
    }
  }
  return rachas;
}
