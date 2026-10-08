import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearPartidoAlineacion } from './alineacion.mapper';
import type { PartidoAlineacion } from './interfaces/partido-alineacion.interface';

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
}
