import type { TipoFase } from './tipo-fase.type';

/** Una fase de la competición, con el grupo en el que juega nuestro equipo. */
export interface Fase {
  readonly id: string;
  readonly tipo: TipoFase;
  readonly nombre: string;
  readonly orden: number;
  /** Página oficial del grupo en la web de la liga. */
  readonly urlGrupo: string | null;
  /** Fecha de inicio en formato AAAA-MM-DD. */
  readonly inicio: string | null;
  /** Fecha de fin en formato AAAA-MM-DD; `null` si no se sabe o no ha acabado. */
  readonly fin: string | null;
}
