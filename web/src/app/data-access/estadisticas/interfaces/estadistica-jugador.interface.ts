import type { ResumenJugador } from './resumen-jugador.interface';

/** Resumen de un jugador con su nombre, para las gráficas de todo el equipo. */
export interface EstadisticaJugador extends ResumenJugador {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly comodin: boolean;
}
