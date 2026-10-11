import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { TipoResultadoPartido } from '@data-access/resultados/interfaces/tipo-resultado-partido.type';

/** Resultado de un partido de una confrontación nuestra. */
export interface PartidoDeJornada {
  readonly confrontacionId: string;
  readonly tipo: TipoPartido;
  readonly numero: number;
  /** `null` si está por jugar. */
  readonly resultado: TipoResultadoPartido | null;
  /** `null` mientras no tiene ganador (por jugar o suspendido). */
  readonly ganado: boolean | null;
}
