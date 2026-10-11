/** Cuántas jornadas jugó un jugador y por qué no jugó el resto. Solo para gestores. */
export interface ParticipacionJugador {
  readonly id: string;
  readonly nombreMostrar: string;
  readonly confrontaciones: number;
  readonly jugadas: number;
  /** Dijo que sí en la encuesta y no jugó. */
  readonly disponibleSinJugar: number;
  readonly noDisponible: number;
  readonly sinResponder: number;
  readonly porcentajeJugadas: number | null;
}
