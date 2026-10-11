/** El jugador que se ha tocado en una gráfica y se resalta en todas las demás. */
export interface JugadorResaltado {
  readonly id: string;
  readonly nombreMostrar: string;
  /** Los comodines se pueden resaltar, pero no tienen ficha pública. */
  readonly comodin: boolean;
}
