import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { mapearConvocables } from './disponibilidad.mapper';
import type { JugadorConvocable } from './interfaces/jugador-convocable.interface';

/**
 * Quién se puede convocar en cada jornada y quién está ya convocado. La disponibilidad es
 * privada: la base de datos solo deja leerla a los gestores. (La encuesta de WhatsApp ya no
 * se registra en la web: ADR 0012.)
 */
@Injectable({ providedIn: 'root' })
export class DisponibilidadService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /**
   * Jugadores que se pueden convocar en una confrontación (plantilla y comodines), con
   * quién está ya convocado. Vacío si la confrontación no existe.
   */
  async obtenerConvocables(
    idConfrontacion: string,
    hoy: Date = new Date(),
  ): Promise<JugadorConvocable[]> {
    const { data: confrontacion, error: errorConfrontacion } = await this.supabase
      .from('confrontacion')
      .select('fase(competicion_id)')
      .eq('id', idConfrontacion)
      .maybeSingle();
    lanzarSiHayError(errorConfrontacion, 'No se ha podido cargar la jornada.');
    if (!confrontacion) {
      return [];
    }

    const [plantilla, disponibilidad] = await Promise.all([
      this.supabase
        .from('plantilla')
        .select('comodin, baja, inscrito_oficial, jugador(id, nombre_mostrar, sexo)')
        .eq('competicion_id', confrontacion.fase.competicion_id),
      this.supabase
        .from('disponibilidad')
        .select('jugador_id, convocado')
        .eq('confrontacion_id', idConfrontacion),
    ]);
    lanzarSiHayError(plantilla.error, 'No se ha podido cargar la plantilla.');
    lanzarSiHayError(disponibilidad.error, 'No se ha podido cargar la convocatoria.');
    return mapearConvocables(
      plantilla.data ?? [],
      disponibilidad.data ?? [],
      fechaIsoEnMadrid(hoy),
    );
  }
}
