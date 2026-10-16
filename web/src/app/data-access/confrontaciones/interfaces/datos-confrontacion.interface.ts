/** Lo que un gestor puede completar de una jornada en cuanto se sabe. `null`: por confirmar. */
export interface DatosConfrontacion {
  /** Día y hora del partido (ISO 8601). */
  readonly fechaHora: string | null;
  readonly sede: string | null;
  /** Pistas disponibles, de 1 a 6. */
  readonly numeroPistas: number | null;
}
