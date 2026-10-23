import type { Racha } from '@shared/utils/interfaces/racha.interface';
import { calcularRacha } from '@shared/utils/rachas';
import type { FaseTemporada } from '../interfaces/fase-temporada.interface';

/**
 * La racha actual de un jugador a partir de su temporada: solo las jornadas que jugó, sin los
 * WO, que no cuentan en sus estadísticas. Las fases llegan en orden, y sus jornadas también.
 */
export function rachaDeTemporada(fases: readonly FaseTemporada[]): Racha | null {
  return calcularRacha(
    fases
      .flatMap((fase) => fase.filas)
      .filter((fila) => fila.resultado !== 'no-jugo' && !fila.esWo)
      .map((fila) => fila.resultado === 'ganado'),
  );
}
