import type { Tables } from '@core/supabase/interfaces/database.types';
import { mapearEquipoResumen } from '@data-access/equipos/equipo.mapper';
import type { PartidosEquipoGrupo } from './interfaces/partidos-equipo-grupo.interface';

export type FilaPartidosGrupo = Pick<
  Tables<'fase_equipo'>,
  'fase_id' | 'partidos_favor' | 'partidos_contra'
> & { equipo: Pick<Tables<'equipo'>, 'id' | 'nombre' | 'es_nuestro'> };

export function mapearPartidosGrupo(fila: FilaPartidosGrupo): PartidosEquipoGrupo {
  return {
    faseId: fila.fase_id,
    equipo: mapearEquipoResumen(fila.equipo),
    partidosFavor: fila.partidos_favor,
    partidosContra: fila.partidos_contra,
  };
}
