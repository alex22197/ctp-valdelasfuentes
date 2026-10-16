import { Injectable, inject } from '@angular/core';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { ENTORNO } from '@core/config/entorno.token';
import type { Database } from './interfaces/database.types';
import { PeticionesEnCursoService } from './peticiones-en-curso.service';

/**
 * Única instancia del cliente de Supabase en toda la aplicación.
 *
 * Solo la usan los servicios de `src/app/data-access` y `core/auth`: ESLint impide
 * importarla desde páginas y componentes. Cada petición pasa por `PeticionesEnCursoService`,
 * que decide cuándo se ve la espera.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseClientService {
  private readonly entorno = inject(ENTORNO);
  private readonly peticiones = inject(PeticionesEnCursoService);

  readonly cliente: SupabaseClient<Database> = createClient<Database>(
    this.entorno.supabase.url,
    this.entorno.supabase.publishableKey,
    {
      global: { fetch: this.peticiones.fetch },
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
}
