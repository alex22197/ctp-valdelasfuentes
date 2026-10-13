/** Datos de la gráfica de evolución: una posición por jornada jugada, en orden. */
export interface EvolucionTemporada {
  readonly confrontaciones: readonly string[];
  /** «J1», «J2»… o el rival en las eliminatorias. */
  readonly etiquetas: readonly string[];
  /** Puntos acumulados de cada fase; `null` en las jornadas de otra fase o pendientes. */
  readonly fases: readonly {
    readonly nombre: string;
    readonly puntos: readonly (number | null)[];
  }[];
  readonly ganados: readonly number[];
}
