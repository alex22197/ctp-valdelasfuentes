import type { EstadoOpcion } from './estado-opcion.type';
import type { OpcionJugador } from './opcion-jugador.interface';

/** Grupo de jugadores del panel («Pueden», «Sin responder»…). */
export interface GrupoOpciones {
  readonly estado: EstadoOpcion;
  readonly titulo: string;
  readonly opciones: readonly OpcionJugador[];
}
