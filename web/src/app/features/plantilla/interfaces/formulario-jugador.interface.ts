import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';

/** Las tres respuestas a «¿está inscrito en la liga?»: aún no se ha mirado, sí o no. */
export type InscritoFormulario = 'sin-comprobar' | 'si' | 'no';

/** Lo que hay escrito en el formulario de un jugador, tal cual llega de los campos. */
export interface FormularioJugador {
  readonly nombreMostrar: string;
  readonly nombreCompleto: string;
  /** `null` mientras no se ha elegido: es obligatorio. */
  readonly sexo: Sexo | null;
  readonly ladoPreferido: Lado | null;
  readonly comodin: boolean;
  readonly inscrito: InscritoFormulario;
}
