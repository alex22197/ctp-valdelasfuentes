import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { Sexo } from './sexo.type';

/** Lo que un gestor guarda de un jugador. Sin `id`, es uno nuevo. */
export interface DatosJugador {
  readonly id: string | null;
  readonly nombreMostrar: string;
  readonly nombreCompleto: string | null;
  readonly sexo: Sexo;
  readonly ladoPreferido: Lado | null;
  readonly comodin: boolean;
  readonly inscritoOficial: boolean | null;
}
