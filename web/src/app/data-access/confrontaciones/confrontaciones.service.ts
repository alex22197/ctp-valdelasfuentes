import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import {
  type FilaConfrontacion,
  type FilaMarcadorCalculado,
  mapearConfrontacionNuestroEquipo,
} from './confrontacion.mapper';
import { mapearFilaDatosConfrontacion } from './datos-confrontacion.mapper';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { DatosConfrontacion } from './interfaces/datos-confrontacion.interface';

const COLUMNAS_CONFRONTACION = `
  id, jornada, estado, fecha_prevista, fecha_hora, sede, num_pistas,
  partidos_local, partidos_visitante, convocatoria_publicada,
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

  /**
   * Guarda el día y la hora, la sede y las pistas de una jornada. Solo los gestores pueden: si
   * la base de datos no deja cambiar la fila (sin permisos o con la sesión caducada), no da
   * error pero tampoco cambia nada, así que se comprueba que se haya guardado.
   */
  async guardarDatos(idConfrontacion: string, datos: DatosConfrontacion): Promise<void> {
    const { data, error } = await this.supabase
      .from('confrontacion')
      .update(mapearFilaDatosConfrontacion(datos))
      .eq('id', idConfrontacion)
      .select('id');
    lanzarSiHayError(error, 'No se han podido guardar los datos de la jornada.');
    if (!data?.length) {
      throw new ErrorAccesoDatos(
        'No se han guardado los datos: entra otra vez con tu cuenta de gestor y vuelve a probar.',
      );
    }
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
