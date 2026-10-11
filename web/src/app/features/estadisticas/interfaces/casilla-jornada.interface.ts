import type { EstadoCasilla } from './estado-casilla.type';

/** Uno de los partidos de una jornada en la cuadrícula. */
export interface CasillaJornada {
  /** «M1», «F2» o «Mixto». */
  readonly codigo: string;
  /** «Masculino 1»: para lectores de pantalla y la ayuda al tocar. */
  readonly nombre: string;
  readonly estado: EstadoCasilla;
  /** Ganado o perdido por WO: la casilla lo dice también con texto. */
  readonly esWo: boolean;
}
