/** Una pareja dentro de la matriz: posición, partidos juntos y porcentaje de victorias. */
export interface CeldaMatriz {
  readonly fila: number;
  readonly columna: number;
  readonly partidos: number;
  readonly porcentajeVictorias: number | null;
}
