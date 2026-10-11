import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { BalancePartidos } from './balance-partidos.interface';
import type { JugadorPareja } from './jugador-pareja.interface';

/** Partidos de una pareja. Cada pareja sale una sola vez, sin orden entre sus jugadores. */
export interface BalancePareja extends BalancePartidos {
  readonly tipo: TipoPartido;
  readonly jugadorA: JugadorPareja;
  readonly jugadorB: JugadorPareja;
}
