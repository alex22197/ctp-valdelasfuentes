import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { BalanceLado } from '@data-access/estadisticas/interfaces/balance-lado.interface';

/**
 * Lado en el que suele jugar: el preferido si está en la plantilla y, si no, en el que ha
 * jugado más partidos. `null` si no se sabe (sin partidos o empatado).
 */
export function ladoHabitual(
  ladoPreferido: Lado | null,
  lados: readonly BalanceLado[],
): Lado | null {
  if (ladoPreferido) {
    return ladoPreferido;
  }
  const [primero, segundo] = [...lados].sort((a, b) => b.partidos - a.partidos);
  if (!primero || primero.partidos === 0 || primero.partidos === segundo?.partidos) {
    return null;
  }
  return primero.lado;
}
