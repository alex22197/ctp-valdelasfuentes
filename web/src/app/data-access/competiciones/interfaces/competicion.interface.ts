/** Una liga en una temporada concreta (por ejemplo, Liga MasterPadel 2026-27). */
export interface Competicion {
  readonly id: string;
  readonly nombre: string;
  readonly temporada: string;
}
