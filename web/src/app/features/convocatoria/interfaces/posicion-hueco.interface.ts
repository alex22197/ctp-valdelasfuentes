import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';

/** Un lado concreto de una pista: «el revés de masculino-1». */
export interface PosicionHueco {
  readonly clave: string;
  readonly lado: Lado;
}
