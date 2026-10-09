import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';

/** Lo que emite una pista al cambiar uno de sus desplegables. */
export interface CambioHueco {
  readonly clave: string;
  readonly lado: Lado;
  readonly idJugador: string | null;
}
