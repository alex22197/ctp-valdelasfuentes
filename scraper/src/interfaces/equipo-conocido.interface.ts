/** Un equipo de nuestra base de datos. */
export interface EquipoConocido {
  readonly id: string;
  readonly nombre: string;
  /** El texto exacto con el que sale en la web de la liga, si ya se sabe. */
  readonly nombreWeb: string | null;
  readonly esNuestro: boolean;
}
