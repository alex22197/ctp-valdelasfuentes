import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { mapearCompeticion, mapearFase } from './competicion.mapper';
import { elegirFaseActual } from './fase-actual';
import type { FaseActual } from './interfaces/fase-actual.interface';

@Injectable({ providedIn: 'root' })
export class CompeticionesService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Competición activa y la fase que se está jugando. `null` si no hay ninguna activa. */
  async obtenerFaseActual(hoy: Date = new Date()): Promise<FaseActual | null> {
    const { data, error } = await this.supabase
      .from('competicion')
      .select('id, nombre, temporada, fase(id, tipo, nombre, orden, url_grupo, inicio)')
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar la competición.');
    if (!data) {
      return null;
    }

    const fase = elegirFaseActual(data.fase.map(mapearFase), fechaIsoEnMadrid(hoy));
    return fase ? { competicion: mapearCompeticion(data), fase } : null;
  }
}
