import type { Competicion } from './competicion.interface';
import type { Fase } from './fase.interface';

/** La fase que se está jugando ahora y la competición a la que pertenece. */
export interface FaseActual {
  readonly competicion: Competicion;
  readonly fase: Fase;
  /**
   * La fase cuya clasificación se enseña: la misma, o la última liga (apertura o clausura) si
   * la actual es una eliminatoria, que no tiene. `null` si no hay ninguna.
   */
  readonly faseClasificacion: Fase | null;
}
