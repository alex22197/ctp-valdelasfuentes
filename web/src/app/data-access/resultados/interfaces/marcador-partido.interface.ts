import type { SetPartido } from './set-partido.interface';
import type { TipoResultadoPartido } from './tipo-resultado-partido.type';

/** Resultado completo de un partido, tal como se guarda. */
export interface MarcadorPartido {
  /** `null` mientras el partido está por jugar. */
  readonly resultado: TipoResultadoPartido | null;
  /** Solo en abandonos: si lo ganamos nosotros. En el resto lo deciden los sets o el WO. */
  readonly ganado: boolean | null;
  /** En orden: set 1, set 2 y set 3. Vacío en los WO y en los partidos por jugar. */
  readonly sets: readonly SetPartido[];
}
