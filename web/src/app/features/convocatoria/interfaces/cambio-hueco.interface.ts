import type { PosicionHueco } from './posicion-hueco.interface';

/** Quién pasa a ocupar un lado de una pista; `null` lo deja sin asignar. */
export interface CambioHueco extends PosicionHueco {
  readonly idJugador: string | null;
}
