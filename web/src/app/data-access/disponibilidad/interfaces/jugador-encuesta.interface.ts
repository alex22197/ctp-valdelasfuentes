import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { RespuestaEncuesta } from './respuesta-encuesta.type';

/** Un jugador de la plantilla con lo que respondió a la encuesta de una jornada. */
export interface JugadorEncuesta {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly sexo: Sexo;
  /** `null` si todavía no ha contestado. */
  readonly respuesta: RespuestaEncuesta | null;
  /** Si ya está en la convocatoria de esa jornada. */
  readonly convocado: boolean;
}
