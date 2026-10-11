import type { CondicionEquipo } from '@data-access/confrontaciones/interfaces/condicion-equipo.type';
import type { ResultadoEnJornada } from './resultado-en-jornada.type';

/** Una jornada jugada por el equipo, vista desde un jugador. */
export interface FilaTemporada {
  readonly confrontacionId: string;
  readonly jornada: number | null;
  readonly rival: string;
  readonly condicion: CondicionEquipo;
  readonly resultado: ResultadoEnJornada;
  /** «Masculino 1 con Sergio, de revés». `null` si no jugó. */
  readonly detalle: string | null;
  /** «6-3 4-6 6-2», «WO a favor» o `null` si no jugó. */
  readonly marcador: string | null;
}
