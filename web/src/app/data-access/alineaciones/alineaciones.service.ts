import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearParejasAParametros, mapearPartidoAlineacion } from './alineacion.mapper';
import type { ParejaAlineacion } from './interfaces/pareja-alineacion.interface';
import type { PartidoAlineacion } from './interfaces/partido-alineacion.interface';

/** Código de PostgreSQL de los `raise exception`: sus mensajes ya están en castellano. */
const CODIGO_ERROR_NORMATIVA = 'P0001';

@Injectable({ providedIn: 'root' })
export class AlineacionesService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /**
   * Partidos de una confrontación con sus parejas, en el orden de la normativa:
   * masculinos, femeninos y mixto. Vacío si aún no hay alineación.
   */
  async obtenerAlineacion(idConfrontacion: string): Promise<PartidoAlineacion[]> {
    const { data, error } = await this.supabase
      .from('partido')
      .select('id, tipo, numero, participacion(lado, jugador(id, nombre_mostrar))')
      .eq('confrontacion_id', idConfrontacion)
      .order('tipo')
      .order('numero');
    lanzarSiHayError(error, 'No se ha podido cargar la alineación.');
    return (data ?? []).map(mapearPartidoAlineacion);
  }

  /**
   * Guarda la alineación entera en una sola operación. Los colocados quedan convocados y
   * quien deja de estarlo pierde la convocatoria (ADR 0009). Si algo incumple la
   * normativa, la base de datos lo rechaza y el error lleva su explicación.
   */
  async guardarAlineacion(
    idConfrontacion: string,
    parejas: readonly ParejaAlineacion[],
  ): Promise<void> {
    const { error } = await this.supabase.rpc('guardar_alineacion', {
      p_confrontacion: idConfrontacion,
      p_parejas: mapearParejasAParametros(parejas),
    });
    if (error) {
      throw new ErrorAccesoDatos(
        mensajeDeError(error, 'No se ha podido guardar la alineación.'),
        error,
      );
    }
  }

  /** Publica la convocatoria para que se vea en la portada, o la devuelve a borrador. */
  async publicarConvocatoria(idConfrontacion: string, publicada: boolean): Promise<void> {
    const { error } = await this.supabase.rpc('publicar_convocatoria', {
      p_confrontacion: idConfrontacion,
      p_publicada: publicada,
    });
    if (error) {
      throw new ErrorAccesoDatos(
        mensajeDeError(error, 'No se ha podido cambiar la publicación.'),
        error,
      );
    }
  }
}

function mensajeDeError(error: { code: string; message: string }, generico: string): string {
  return error.code === CODIGO_ERROR_NORMATIVA
    ? `${error.message}.`
    : `${generico} Comprueba la conexión y vuelve a intentarlo.`;
}
