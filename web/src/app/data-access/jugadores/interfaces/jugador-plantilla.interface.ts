import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { Sexo } from './sexo.type';

/** Un jugador tal como está en la plantilla de una competición. */
export interface JugadorPlantilla {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly sexo: Sexo;
  readonly ladoPreferido: Lado | null;
  /** Los comodines refuerzan al equipo de vez en cuando y no tienen ficha pública. */
  readonly comodin: boolean;
}
