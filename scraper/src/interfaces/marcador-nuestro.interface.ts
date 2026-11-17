/** El marcador de una confrontación nuestra calculado con los resultados que metemos nosotros. */
export interface MarcadorNuestro {
  readonly confrontacionId: string;
  readonly partidosGanados: number;
  readonly partidosPerdidos: number;
  readonly partidosPendientes: number;
}
