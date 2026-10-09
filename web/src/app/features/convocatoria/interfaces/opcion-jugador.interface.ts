/** Un jugador en el desplegable de un lado de la pista. */
export interface OpcionJugador {
  readonly id: string;
  /** Nombre y, si ya está en otra pista, cuál: «Sergio (en Masculino 1)». */
  readonly etiqueta: string;
}
