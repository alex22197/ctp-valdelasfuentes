/** Partidos jugados, ganados y perdidos, con el porcentaje calculado en la base de datos. */
export interface BalancePartidos {
  readonly partidos: number;
  readonly ganados: number;
  readonly perdidos: number;
  /** Porcentaje de victorias redondeado; `null` si no hay partidos. */
  readonly porcentajeVictorias: number | null;
}
