import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearFilaClasificacion } from './clasificacion.mapper';
import type { FilaClasificacion } from './interfaces/fila-clasificacion.interface';
import type { PartidosEquipoGrupo } from './interfaces/partidos-equipo-grupo.interface';
import { mapearPartidosGrupo } from './partidos-grupo.mapper';

@Injectable({ providedIn: 'root' })
export class ClasificacionService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Clasificación oficial de una fase, ordenada por posición. */
  async obtenerClasificacion(idFase: string): Promise<FilaClasificacion[]> {
    const { data, error } = await this.supabase
      .from('fase_equipo')
      .select(
        'posicion, puntos, ganados, empatados, perdidos, partidos_favor, partidos_contra, actualizado_en, equipo(id, nombre, es_nuestro)',
      )
      .eq('fase_id', idFase)
      .order('posicion', { ascending: true, nullsFirst: false });
    lanzarSiHayError(error, 'No se ha podido cargar la clasificación.');
    return (data ?? []).map(mapearFilaClasificacion);
  }

  /** Partidos a favor y en contra de cada equipo del grupo en las fases indicadas. */
  async obtenerPartidosDelGrupo(idsFases: readonly string[]): Promise<PartidosEquipoGrupo[]> {
    if (idsFases.length === 0) {
      return [];
    }
    const { data, error } = await this.supabase
      .from('fase_equipo')
      .select('fase_id, partidos_favor, partidos_contra, equipo(id, nombre, es_nuestro)')
      .in('fase_id', [...idsFases]);
    lanzarSiHayError(error, 'No se han podido cargar los partidos del grupo.');
    return (data ?? []).map(mapearPartidosGrupo);
  }
}
