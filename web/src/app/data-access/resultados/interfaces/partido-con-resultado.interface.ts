import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { MarcadorPartido } from './marcador-partido.interface';

/** Uno de los partidos de una confrontación con su pareja y su marcador. */
export interface PartidoConResultado {
  readonly tipo: TipoPartido;
  readonly numero: number;
  readonly reves: JugadorAlineado | null;
  readonly drive: JugadorAlineado | null;
  readonly marcador: MarcadorPartido;
}
