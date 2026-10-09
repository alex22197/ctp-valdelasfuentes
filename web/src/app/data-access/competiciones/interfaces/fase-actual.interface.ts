import type { Competicion } from './competicion.interface';
import type { Fase } from './fase.interface';

/** La fase que se está jugando ahora y la competición a la que pertenece. */
export interface FaseActual {
  readonly competicion: Competicion;
  readonly fase: Fase;
}
