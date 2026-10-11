import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { BalancePartidos } from './balance-partidos.interface';

/** Partidos de un jugador en un puesto de la alineación: masculino 2, mixto… */
export interface BalancePuesto extends BalancePartidos {
  readonly tipo: TipoPartido;
  readonly numero: number;
}
