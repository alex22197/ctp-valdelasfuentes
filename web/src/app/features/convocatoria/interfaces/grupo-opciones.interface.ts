import type { OpcionJugador } from './opcion-jugador.interface';

/** Grupo de un desplegable de jugadores («Pueden», «Sin responder»…). */
export interface GrupoOpciones {
  readonly titulo: string;
  readonly opciones: readonly OpcionJugador[];
}
