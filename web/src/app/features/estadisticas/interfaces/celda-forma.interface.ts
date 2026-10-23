import type { EstadoForma } from './estado-forma.type';

/** Una casilla del mapa de forma: un jugador en una jornada. */
export interface CeldaForma {
  readonly fila: number;
  readonly columna: number;
  readonly estado: EstadoForma;
  /** «Pablo, J2 contra Padel Attraction B: perdió 2-6 4-6 con Iván». */
  readonly detalle: string;
}
