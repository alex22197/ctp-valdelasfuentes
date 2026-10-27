import type { EquipoResumen } from '@data-access/equipos/interfaces/equipo-resumen.interface';

/** Partidos a favor y en contra de un equipo del grupo en una fase; `null` si no se saben. */
export interface PartidosEquipoGrupo {
  readonly faseId: string;
  readonly equipo: EquipoResumen;
  readonly partidosFavor: number | null;
  readonly partidosContra: number | null;
}
