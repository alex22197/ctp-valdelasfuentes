import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import {
  type FilaConfrontacion,
  type FilaMarcadorCalculado,
  mapearConfrontacionNuestroEquipo,
} from './confrontacion.mapper';
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
    return this.mapearConMarcadores(data ?? []);
  }

  /** Una confrontación de nuestro equipo, o `null` si no existe o no jugamos en ella. */
  async obtenerConfrontacion(idConfrontacion: string): Promise<ConfrontacionNuestroEquipo | null> {
    const { data, error } = await this.supabase
      .from('confrontacion')
      .select(COLUMNAS_CONFRONTACION)
      .eq('id', idConfrontacion)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar la jornada.');
    const [confrontacion] = await this.mapearConMarcadores(data ? [data] : []);
    return confrontacion ?? null;
  }

  private async mapearConMarcadores(
    filas: readonly FilaConfrontacion[],
  ): Promise<ConfrontacionNuestroEquipo[]> {
    const marcadores = await this.obtenerMarcadoresCalculados(filas.map((fila) => fila.id));
    return filas
      .map((fila) => mapearConfrontacionNuestroEquipo(fila, marcadores.get(fila.id) ?? null))
      .filter((confrontacion) => confrontacion !== null);
  }

  /** Partidos ganados y perdidos según nuestros resultados, por confrontación. */
  private async obtenerMarcadoresCalculados(
    idsConfrontacion: readonly string[],
  ): Promise<ReadonlyMap<string, FilaMarcadorCalculado>> {
    if (idsConfrontacion.length === 0) {
      return new Map();
    }
    const { data, error } = await this.supabase
      .from('confrontacion_marcador')
      .select('confrontacion_id, partidos_ganados, partidos_perdidos, partidos_pendientes')
      .in('confrontacion_id', [...idsConfrontacion]);
    lanzarSiHayError(error, 'No se han podido cargar los resultados de las jornadas.');
    return new Map(
      (data ?? []).flatMap((fila) =>
        fila.confrontacion_id ? [[fila.confrontacion_id, fila] as const] : [],
      ),
    );
  }
}
