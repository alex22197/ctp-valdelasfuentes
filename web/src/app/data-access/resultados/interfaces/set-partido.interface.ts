/** Marcador de un set desde nuestro lado, con el tie-break si acabó 7-6. */
export interface SetPartido {
  readonly juegosNuestros: number;
  readonly juegosRival: number;
  readonly tiebreakNuestros: number | null;
  readonly tiebreakRival: number | null;
}
