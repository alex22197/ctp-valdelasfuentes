import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { BalancePartidos } from './balance-partidos.interface';

/** Partidos de un jugador en un lado de la pista. */
export interface BalanceLado extends BalancePartidos {
  readonly lado: Lado;
}
