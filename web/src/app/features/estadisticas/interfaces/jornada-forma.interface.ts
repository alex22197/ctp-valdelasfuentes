/** Una columna del mapa de forma. */
export interface JornadaForma {
  readonly confrontacionId: string;
  /** «J2», o el rival si la jornada no tiene número. */
  readonly etiqueta: string;
  readonly rival: string;
}
