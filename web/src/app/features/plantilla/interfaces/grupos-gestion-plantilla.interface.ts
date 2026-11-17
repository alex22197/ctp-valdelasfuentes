import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';

/** La plantilla repartida como la gestiona el capitán: por sexo, comodines aparte y las bajas al final. */
export interface GruposGestionPlantilla {
  readonly chicos: readonly JugadorGestion[];
  readonly chicas: readonly JugadorGestion[];
  readonly comodines: readonly JugadorGestion[];
  readonly bajas: readonly JugadorGestion[];
}
