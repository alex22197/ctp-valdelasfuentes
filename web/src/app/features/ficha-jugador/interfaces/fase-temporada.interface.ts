import type { FilaTemporada } from './fila-temporada.interface';

/** Las jornadas de una fase en la temporada de un jugador. */
export interface FaseTemporada {
  readonly nombre: string;
  readonly filas: readonly FilaTemporada[];
}
