import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';

/** Cuánto mejor o peor rinde una pareja junta que sus dos jugadores por separado. */
export interface QuimicaPareja {
  readonly pareja: BalancePareja;
  /** Porcentaje de victorias de la pareja. */
  readonly juntos: number;
  /** Media del porcentaje de victorias de cada uno de los dos. */
  readonly separados: number;
  /** `juntos` menos `separados`: positivo si la pareja suma, negativo si resta. */
  readonly quimica: number;
}
