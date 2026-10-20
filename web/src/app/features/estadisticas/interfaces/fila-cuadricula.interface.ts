import type { CondicionEquipo } from '@data-access/confrontaciones/interfaces/condicion-equipo.type';
import type { GrupoCuadricula } from './grupo-cuadricula.interface';

/** Una jornada jugada con sus partidos por categoría, en el orden de la normativa. */
export interface FilaCuadricula {
  readonly confrontacionId: string;
  readonly jornada: number | null;
  readonly rival: string;
  readonly condicion: CondicionEquipo;
  readonly grupos: readonly GrupoCuadricula[];
  /** Partidos ganados y perdidos: «4-2». */
  readonly marcador: string;
  /** `null` mientras quede algún partido pendiente. */
  readonly puntos: number | null;
}
