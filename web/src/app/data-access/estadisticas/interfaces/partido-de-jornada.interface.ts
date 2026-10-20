import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { SetPartido } from '@data-access/resultados/interfaces/set-partido.interface';
import type { TipoResultadoPartido } from '@data-access/resultados/interfaces/tipo-resultado-partido.type';

/** Resultado de un partido de una confrontación nuestra, con quién lo jugó y sus sets. */
export interface PartidoDeJornada {
  readonly confrontacionId: string;
  readonly tipo: TipoPartido;
  readonly numero: number;
  /** `null` si está por jugar. */
  readonly resultado: TipoResultadoPartido | null;
  /** `null` mientras no tiene ganador (por jugar o suspendido). */
  readonly ganado: boolean | null;
  readonly reves: JugadorAlineado | null;
  readonly drive: JugadorAlineado | null;
  /** En orden; vacío en los WO y en los partidos por jugar. */
  readonly sets: readonly SetPartido[];
}
