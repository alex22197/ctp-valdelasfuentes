import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearConfrontacionNuestroEquipo } from './confrontacion.mapper';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';

const COLUMNAS_CONFRONTACION = `
  id, jornada, estado, fecha_prevista, fecha_hora, sede, num_pistas,
  partidos_local, partidos_visitante,
  local:equipo!confrontacion_local_id_fkey(id, nombre, es_nuestro),
  visitante:equipo!confrontacion_visitante_id_fkey(id, nombre, es_nuestro)
`;

@Injectable({ providedIn: 'root' })
export class ConfrontacionesService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Jornadas de nuestro equipo en una fase, en orden de calendario. */
  async obtenerCalendarioNuestroEquipo(idFase: string): Promise<ConfrontacionNuestroEquipo[]> {
    const { data, error } = await this.supabase
      .from('confrontacion')
      .select(COLUMNAS_CONFRONTACION)
      .eq('fase_id', idFase)
      .order('jornada', { ascending: true, nullsFirst: false })
      .order('fecha_prevista', { ascending: true, nullsFirst: false });
    lanzarSiHayError(error, 'No se ha podido cargar el calendario.');

    return (data ?? [])
      .map(mapearConfrontacionNuestroEquipo)
      .filter((confrontacion) => confrontacion !== null);
  }
}
