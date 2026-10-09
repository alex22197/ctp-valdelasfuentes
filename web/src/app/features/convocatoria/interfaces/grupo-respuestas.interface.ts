import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';

/** Uno de los cuatro grupos de respuestas a la encuesta de la vista de capitán. */
export interface GrupoRespuestas {
  readonly variante: 'convocados' | 'pueden' | 'no-pueden' | 'sin-responder';
  readonly titulo: string;
  readonly jugadores: readonly JugadorConvocable[];
}
