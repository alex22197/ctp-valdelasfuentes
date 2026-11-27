import { Injectable, inject } from '@angular/core';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearEjecucionScraper } from './ejecucion-scraper.mapper';
import type { EjecucionScraper } from './interfaces/ejecucion-scraper.interface';

/** El registro de las lecturas de la web de la liga. Solo lo pueden leer los gestores. */
@Injectable({ providedIn: 'root' })
export class EjecucionesScraperService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** La última lectura registrada, o `null` si el scraper aún no ha registrado ninguna. */
  async obtenerUltima(): Promise<EjecucionScraper | null> {
    const { data, error } = await this.supabase
      .from('ejecucion_scraper')
      .select('fecha, ok, mensaje')
      .order('fecha', { ascending: false })
      .limit(1)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido comprobar la última lectura de la liga.');
    return data ? mapearEjecucionScraper(data) : null;
  }
}
