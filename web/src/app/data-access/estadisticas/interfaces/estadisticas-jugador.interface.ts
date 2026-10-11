import type { BalanceCompanero } from './balance-companero.interface';
import type { BalanceLado } from './balance-lado.interface';
import type { BalancePuesto } from './balance-puesto.interface';
import type { PartidoDeJugador } from './partido-de-jugador.interface';
import type { ResumenJugador } from './resumen-jugador.interface';

/** Todo lo que enseña la ficha de un jugador en una competición. */
export interface EstadisticasJugador {
  /** `null` si todavía no ha jugado ningún partido. */
  readonly resumen: ResumenJugador | null;
  readonly lados: readonly BalanceLado[];
  readonly puestos: readonly BalancePuesto[];
  /** Ordenados de más a menos partidos juntos. */
  readonly companeros: readonly BalanceCompanero[];
  readonly partidos: readonly PartidoDeJugador[];
}
