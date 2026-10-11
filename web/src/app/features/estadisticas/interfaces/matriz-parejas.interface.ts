import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { CeldaMatriz } from './celda-matriz.interface';

/** «Quién con quién»: jugadores en filas y columnas, y una celda por cada pareja. */
export interface MatrizParejas {
  readonly filas: readonly JugadorPareja[];
  readonly columnas: readonly JugadorPareja[];
  readonly celdas: readonly CeldaMatriz[];
}
