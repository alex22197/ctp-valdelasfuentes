import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';

/** Un partido decidido que jugó un jugador (incluye los WO a favor). */
export interface PartidoDeJugador {
  readonly confrontacionId: string;
  readonly tipo: TipoPartido;
  readonly numero: number;
  readonly lado: Lado;
  readonly ganado: boolean;
  readonly esWo: boolean;
  /** Juegos de cada set desde nuestro lado: «6-3 4-6». `null` en los WO. */
  readonly marcador: string | null;
  /** Juegos de todos los sets; 0 en los WO. */
  readonly juegosGanados: number;
  readonly juegosPerdidos: number;
  readonly companero: JugadorAlineado | null;
}
