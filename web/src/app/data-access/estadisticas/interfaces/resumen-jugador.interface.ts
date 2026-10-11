import type { BalancePartidos } from './balance-partidos.interface';

/** Totales de un jugador en la competición. Sin WO (ADR 0006), que se cuentan aparte. */
export interface ResumenJugador extends BalancePartidos {
  readonly setsGanados: number;
  readonly setsPerdidos: number;
  readonly juegosGanados: number;
  readonly juegosPerdidos: number;
  /** Confrontaciones en las que jugó algún partido. */
  readonly jornadas: number;
  readonly woAFavor: number;
}
