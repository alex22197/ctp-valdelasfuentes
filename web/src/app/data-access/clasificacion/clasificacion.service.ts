import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearFilaClasificacion } from './clasificacion.mapper';
import type { FilaClasificacion } from './interfaces/fila-clasificacion.interface';

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
}
