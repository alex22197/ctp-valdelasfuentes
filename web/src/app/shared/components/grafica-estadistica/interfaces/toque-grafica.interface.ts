/** Lo que se ha tocado en una gráfica: un dato de una serie o una etiqueta de un eje. */
export interface ToqueGrafica {
  /** `series` (barra, casilla, punto…) o el eje cuya etiqueta se tocó (`xAxis`, `yAxis`). */
  readonly componente: string;
  /** Índice del dato en su serie; `null` si se tocó una etiqueta. */
  readonly indice: number | null;
  readonly indiceSerie: number | null;
  /** Texto de la etiqueta tocada; `null` si se tocó un dato. */
  readonly etiqueta: string | null;
}
