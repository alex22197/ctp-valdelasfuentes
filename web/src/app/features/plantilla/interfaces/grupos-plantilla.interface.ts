import type { FilaPlantilla } from './fila-plantilla.interface';

/** La plantilla separada en chicos, chicas y comodines, cada grupo por orden alfabético. */
export interface GruposPlantilla {
  readonly chicos: readonly FilaPlantilla[];
  readonly chicas: readonly FilaPlantilla[];
  /** Refuerzan al equipo de vez en cuando y no tienen ficha pública. */
  readonly comodines: readonly FilaPlantilla[];
}
