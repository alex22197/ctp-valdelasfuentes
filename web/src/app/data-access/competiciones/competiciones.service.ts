import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { mapearCompeticion, mapearFase, mapearFormato } from './competicion.mapper';
import { elegirFaseActual } from './fase-actual';
import type { CompeticionActiva } from './interfaces/competicion-activa.interface';
import type { Competicion } from './interfaces/competicion.interface';
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

  /** Competición activa, aunque ninguna de sus fases esté en juego. `null` si no hay. */
  async obtenerCompeticionActiva(): Promise<Competicion | null> {
    const { data, error } = await this.supabase
      .from('competicion')
      .select('id, nombre, temporada')
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar la competición.');
    return data ? mapearCompeticion(data) : null;
  }

  /** Competición activa con sus fases por orden y su formato. `null` si no hay ninguna. */
  async obtenerCompeticionActivaConFases(): Promise<CompeticionActiva | null> {
    const { data, error } = await this.supabase
      .from('competicion')
      .select('id, nombre, temporada, formato, fase(id, tipo, nombre, orden, url_grupo, inicio)')
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar la competición.');
    if (!data) {
      return null;
    }
    return {
      competicion: mapearCompeticion(data),
      fases: data.fase.map(mapearFase).sort((a, b) => a.orden - b.orden),
      formato: mapearFormato(data.formato),
    };
  }
}
