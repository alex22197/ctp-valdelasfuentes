import type { JugadorEncuesta } from './jugador-encuesta.interface';

/** Jugador que se puede colocar en la alineación: la plantilla más los comodines. */
export interface JugadorConvocable extends JugadorEncuesta {
  readonly comodin: boolean;
  /** `null` si aún no se ha comprobado en la lista oficial de la liga. */
  readonly inscritoOficial: boolean | null;
}
