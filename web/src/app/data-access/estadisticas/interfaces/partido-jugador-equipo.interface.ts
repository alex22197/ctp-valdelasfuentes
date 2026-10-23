import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { JugadorPareja } from './jugador-pareja.interface';

/**
 * Un partido decidido de un jugador, con quién es, para las gráficas de todo el equipo (mapa
 * de forma, rachas). Incluye los WO a favor, marcados con `esWo`.
 */
export interface PartidoJugadorEquipo {
  readonly jugador: JugadorPareja;
  readonly confrontacionId: string;
  readonly tipo: TipoPartido;
  readonly numero: number;
  readonly lado: Lado;
  readonly ganado: boolean;
  readonly esWo: boolean;
  /** «6-3 4-6 6-2»; `null` en los WO. */
  readonly marcador: string | null;
  readonly companero: string | null;
}
