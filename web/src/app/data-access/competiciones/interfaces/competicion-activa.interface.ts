import type { Competicion } from './competicion.interface';
import type { Fase } from './fase.interface';
import type { FormatoCompeticion } from './formato-competicion.interface';

/** La competición activa con todas sus fases (por orden) y su formato de partidos. */
export interface CompeticionActiva {
  readonly competicion: Competicion;
  readonly fases: readonly Fase[];
  readonly formato: FormatoCompeticion;
}
