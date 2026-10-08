import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { RespuestaEncuesta } from '@data-access/disponibilidad/interfaces/respuesta-encuesta.type';

/** Lo que se emite al tocar un botón: a quién y qué respondió. */
export interface RespuestaJugador {
  readonly jugador: JugadorEncuesta;
  readonly respuesta: RespuestaEncuesta | null;
}
