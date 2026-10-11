import type { BalancePartidos } from './balance-partidos.interface';

/** Partidos de un jugador junto a uno de sus compañeros. */
export interface BalanceCompanero extends BalancePartidos {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly comodin: boolean;
}
