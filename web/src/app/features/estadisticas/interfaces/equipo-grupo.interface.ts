import type { EquipoResumen } from '@data-access/equipos/interfaces/equipo-resumen.interface';

/** Un equipo del grupo con sus partidos a favor y en contra sumados en las fases elegidas. */
export interface EquipoGrupo {
  readonly equipo: EquipoResumen;
  readonly favor: number;
  readonly contra: number;
  readonly diferencia: number;
}
