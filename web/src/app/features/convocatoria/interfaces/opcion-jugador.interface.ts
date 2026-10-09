import type { EstadoOpcion } from './estado-opcion.type';

/** Un jugador en el panel para elegir quién juega en un lado de la pista. */
export interface OpcionJugador {
  readonly id: string;
  readonly nombre: string;
  readonly iniciales: string;
  readonly estado: EstadoOpcion;
  /** Pista en la que ya está («M2», «Mixto»), o `null` si está libre. */
  readonly otraPista: string | null;
}
