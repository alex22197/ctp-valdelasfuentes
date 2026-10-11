import type { CondicionEquipo } from '@data-access/confrontaciones/interfaces/condicion-equipo.type';

/** Una confrontación nuestra que ya se ha jugado, con su marcador. */
export interface JornadaJugada {
  readonly confrontacionId: string;
  readonly faseId: string;
  readonly faseNombre: string;
  readonly faseOrden: number;
  /** Nulo en las eliminatorias, que no tienen número de jornada. */
  readonly jornada: number | null;
  readonly rival: string;
  readonly condicion: CondicionEquipo;
  readonly partidosGanados: number;
  readonly partidosPerdidos: number;
  /** 2, 1 o 0, sin sanciones; `null` mientras quede algún partido pendiente. */
  readonly puntos: number | null;
}
