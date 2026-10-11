import type { CondicionEquipo } from '@data-access/confrontaciones/interfaces/condicion-equipo.type';
import type { CasillaJornada } from './casilla-jornada.interface';

/** Una jornada jugada con sus partidos en el orden de la normativa. */
export interface FilaCuadricula {
  readonly confrontacionId: string;
  readonly jornada: number | null;
  readonly rival: string;
  readonly condicion: CondicionEquipo;
  readonly casillas: readonly CasillaJornada[];
  /** Partidos ganados y perdidos: «4-2». */
  readonly marcador: string;
  /** `null` mientras quede algún partido pendiente. */
  readonly puntos: number | null;
}
