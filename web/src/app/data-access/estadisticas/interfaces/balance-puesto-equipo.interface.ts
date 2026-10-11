import type { BalancePuesto } from './balance-puesto.interface';

/** Partidos del equipo en un puesto de la alineación, con los WO (que aquí sí cuentan). */
export interface BalancePuestoEquipo extends BalancePuesto {
  readonly woAFavor: number;
  readonly woEnContra: number;
}
