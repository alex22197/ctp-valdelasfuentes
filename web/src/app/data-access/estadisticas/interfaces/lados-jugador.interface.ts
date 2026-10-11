import type { BalancePartidos } from './balance-partidos.interface';

/** Partidos de un jugador de revés y de drive. */
export interface LadosJugador {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly comodin: boolean;
  readonly reves: BalancePartidos;
  readonly drive: BalancePartidos;
}
