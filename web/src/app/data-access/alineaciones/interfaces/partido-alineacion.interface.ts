import type { JugadorAlineado } from './jugador-alineado.interface';
import type { TipoPartido } from './tipo-partido.type';

/** Uno de los partidos de una confrontación con la pareja que lo juega. */
export interface PartidoAlineacion {
  readonly id: string;
  readonly tipo: TipoPartido;
  /** Número de pareja dentro de su tipo: masculino 1, 2 y 3; femenino 1 y 2; mixto 1. */
  readonly numero: number;
  readonly reves: JugadorAlineado | null;
  readonly drive: JugadorAlineado | null;
}
