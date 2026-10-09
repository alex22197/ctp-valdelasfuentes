import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import {
  type FilaDisponibilidad,
  type FilaPlantillaEncuesta,
  mapearConvocables,
  mapearListaEncuesta,
} from './disponibilidad.mapper';
import type { JugadorConvocable } from './interfaces/jugador-convocable.interface';
import type { JugadorEncuesta } from './interfaces/jugador-encuesta.interface';
import type { RespuestaEncuesta } from './interfaces/respuesta-encuesta.type';

/** Código de PostgreSQL de los `raise exception`: sus mensajes ya están en castellano. */
const CODIGO_ERROR_NORMATIVA = 'P0001';

/**
 * Respuestas a la encuesta de disponibilidad de cada jornada. Son privadas: la base de
 * datos solo deja leerlas y escribirlas a los gestores.
 */
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /**
   * Jugadores de la plantilla (sin comodines ni bajas) con lo que respondieron a la
   * encuesta de una confrontación. Vacío si la confrontación no existe.
   */
  async obtenerListaEncuesta(
    idConfrontacion: string,
    hoy: Date = new Date(),
  ): Promise<JugadorEncuesta[]> {
    const filas = await this.obtenerFilas(idConfrontacion);
    return mapearListaEncuesta(filas.plantilla, filas.disponibilidad, fechaIsoEnMadrid(hoy));
  }

  /**
   * Jugadores que se pueden convocar en una confrontación (plantilla y comodines) con su
   * respuesta a la encuesta. Vacío si la confrontación no existe.
   */
  async obtenerConvocables(
    idConfrontacion: string,
    hoy: Date = new Date(),
  ): Promise<JugadorConvocable[]> {
    const filas = await this.obtenerFilas(idConfrontacion);
    return mapearConvocables(filas.plantilla, filas.disponibilidad, fechaIsoEnMadrid(hoy));
  }

  /** Plantilla de la competición de la confrontación y sus filas de disponibilidad. */
  private async obtenerFilas(idConfrontacion: string): Promise<{
    plantilla: FilaPlantillaEncuesta[];
    disponibilidad: FilaDisponibilidad[];
  }> {
    const { data: confrontacion, error: errorConfrontacion } = await this.supabase
      .from('confrontacion')
      .select('fase(competicion_id)')
      .eq('id', idConfrontacion)
      .maybeSingle();
    lanzarSiHayError(errorConfrontacion, 'No se ha podido cargar la jornada.');
    if (!confrontacion) {
      return { plantilla: [], disponibilidad: [] };
    }

    const [plantilla, disponibilidad] = await Promise.all([
      this.supabase
        .from('plantilla')
        .select('comodin, baja, inscrito_oficial, jugador(id, nombre_mostrar, sexo)')
        .eq('competicion_id', confrontacion.fase.competicion_id),
      this.supabase
        .from('disponibilidad')
        .select('jugador_id, respuesta, convocado')
        .eq('confrontacion_id', idConfrontacion),
    ]);
    lanzarSiHayError(plantilla.error, 'No se ha podido cargar la plantilla.');
    lanzarSiHayError(disponibilidad.error, 'No se han podido cargar las respuestas.');
    return { plantilla: plantilla.data ?? [], disponibilidad: disponibilidad.data ?? [] };
  }

  /** Guarda la respuesta de un jugador; `null` lo devuelve a «sin responder». */
  async guardarRespuesta(
    idConfrontacion: string,
    idJugador: string,
    respuesta: RespuestaEncuesta | null,
  ): Promise<void> {
    const { error } = await this.supabase.rpc('guardar_respuesta_encuesta', {
      p_confrontacion: idConfrontacion,
      p_jugador: idJugador,
      ...(respuesta === null ? {} : { p_respuesta: respuesta }),
    });
    if (error) {
      const mensaje =
        error.code === CODIGO_ERROR_NORMATIVA
          ? `${error.message}.`
          : 'No se ha podido guardar. Comprueba la conexión y vuelve a intentarlo.';
      throw new ErrorAccesoDatos(mensaje, error);
    }
  }
}
