import type { RespuestaEncuesta } from '@data-access/disponibilidad/interfaces/respuesta-encuesta.type';

/** Uno de los tres botones de cada jugador: Sí, No o ? (sin responder). */
export interface OpcionRespuesta {
  readonly valor: RespuestaEncuesta | null;
  readonly etiqueta: string;
  /** Texto para lectores de pantalla, más claro que «?». */
  readonly descripcion: string;
}
