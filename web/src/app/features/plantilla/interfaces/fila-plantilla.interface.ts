/** Un jugador en la lista de la plantilla, con su balance de la temporada. */
export interface FilaPlantilla {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly iniciales: string;
  readonly partidos: number;
  /** `null` si todavía no ha jugado ningún partido. */
  readonly porcentajeVictorias: number | null;
}
