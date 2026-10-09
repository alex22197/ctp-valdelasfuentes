import type { TipoPartido } from './tipo-partido.type';

/** Quién juega en cada lado de una pista, tal como se guarda. `null` = hueco sin cubrir. */
export interface ParejaAlineacion {
  readonly tipo: TipoPartido;
  readonly numero: number;
  readonly idReves: string | null;
  readonly idDrive: string | null;
}
