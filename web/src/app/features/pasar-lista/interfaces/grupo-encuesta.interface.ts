import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { RecuentoEncuesta } from './recuento-encuesta.interface';

/** Chicos o chicas de la lista, ordenados por nombre, con su recuento. */
export interface GrupoEncuesta {
  readonly sexo: Sexo;
  readonly titulo: string;
  readonly jugadores: readonly JugadorEncuesta[];
  readonly recuento: RecuentoEncuesta;
}
