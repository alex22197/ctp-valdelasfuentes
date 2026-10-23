import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { CeldaForma } from './celda-forma.interface';
import type { JornadaForma } from './jornada-forma.interface';

/** Mapa de forma: jugadores en filas, jornadas en columnas y una casilla por cada cruce. */
export interface MapaForma {
  readonly jugadores: readonly JugadorPareja[];
  readonly jornadas: readonly JornadaForma[];
  readonly celdas: readonly CeldaForma[];
}
