/** Una lectura semanal de la web de la liga, tal como la dejó registrada el scraper. */
export interface EjecucionScraper {
  /** Cuándo terminó (ISO 8601). */
  readonly fecha: string;
  readonly ok: boolean;
  /** Lo que falló, una línea por fase: «Clausura…: No se ha podido leer…». */
  readonly errores: readonly string[];
  /** Lo que avisó aunque fuera bien: un marcador que no cuadra, ninguna fase en juego. */
  readonly avisos: readonly string[];
}
