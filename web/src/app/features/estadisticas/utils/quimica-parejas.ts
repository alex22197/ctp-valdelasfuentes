import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { EstadisticaJugador } from '@data-access/estadisticas/interfaces/estadistica-jugador.interface';
import type { QuimicaPareja } from '../interfaces/quimica-pareja.interface';

/** Con un solo partido no hay química que medir. */
export const MINIMO_PARTIDOS_QUIMICA = 2;

/**
 * Química de cada pareja con partidos suficientes: su porcentaje de victorias juntos frente
 * a la media del de sus dos jugadores. De la que más suma a la que más resta.
 */
export function calcularQuimica(
  parejas: readonly BalancePareja[],
  jugadores: readonly EstadisticaJugador[],
): QuimicaPareja[] {
  const porcentaje = new Map(jugadores.map((j) => [j.id, j.porcentajeVictorias ?? 0]));
  return parejas
    .filter((pareja) => pareja.partidos >= MINIMO_PARTIDOS_QUIMICA)
    .map((pareja) => {
      const juntos = pareja.porcentajeVictorias ?? 0;
      const separados = Math.round(
        ((porcentaje.get(pareja.jugadorA.id) ?? 0) + (porcentaje.get(pareja.jugadorB.id) ?? 0)) / 2,
      );
      return { pareja, juntos, separados, quimica: juntos - separados };
    })
    .sort((a, b) => b.quimica - a.quimica || b.pareja.partidos - a.pareja.partidos);
}

/** «+25» o «-10». */
export function signoQuimica(quimica: number): string {
  return quimica > 0 ? `+${quimica}` : String(quimica);
}
