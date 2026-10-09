import type { ParejaAlineacion } from '@data-access/alineaciones/interfaces/pareja-alineacion.interface';

/** Una pista de la alineación mientras se edita. */
export interface HuecoAlineacion extends ParejaAlineacion {
  /** WO en contra: no juega nadie, así que la pista no se puede editar. */
  readonly bloqueado: boolean;
}
