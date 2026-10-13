import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';

/** Jugador que se puede colocar en la alineación: la plantilla más los comodines. */
export interface JugadorConvocable {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly sexo: Sexo;
  /** Si ya está en la convocatoria de esa jornada. */
  readonly convocado: boolean;
  readonly comodin: boolean;
  /** `null` si aún no se ha comprobado en la lista oficial de la liga. */
  readonly inscritoOficial: boolean | null;
}
