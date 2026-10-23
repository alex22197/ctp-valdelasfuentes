import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { CondicionEquipo } from '@data-access/confrontaciones/interfaces/condicion-equipo.type';

/**
 * Un partido decidido del equipo con sus sets, visto desde el equipo. Los WO sí están
 * (`esWo`), porque cuentan para el equipo; van sin sets.
 */
export interface PartidoEquipo {
  readonly confrontacionId: string;
  readonly faseId: string;
  readonly jornada: number | null;
  readonly condicion: CondicionEquipo;
  readonly tipo: TipoPartido;
  readonly numero: number;
  readonly ganado: boolean;
  readonly esWo: boolean;
  readonly setsJugados: number;
  readonly setsGanados: number;
  readonly setsPerdidos: number;
  /** Sets que acabaron 7-6, de un lado o del otro. */
  readonly tiebreaksJugados: number;
  readonly tiebreaksGanados: number;
}
