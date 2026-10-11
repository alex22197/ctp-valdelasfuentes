import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { esUuid } from '@shared/utils/es-uuid';
import { mapearJugadorPlantilla } from './jugador.mapper';
import type { JugadorPlantilla } from './interfaces/jugador-plantilla.interface';

@Injectable({ providedIn: 'root' })
export class JugadoresService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Un jugador de la plantilla de una competición. `null` si no está o el id no es válido. */
  async obtenerJugadorDePlantilla(
    idCompeticion: string,
    idJugador: string,
  ): Promise<JugadorPlantilla | null> {
    if (!esUuid(idJugador)) {
      return null;
    }
    const { data, error } = await this.supabase
      .from('plantilla')
      .select('comodin, jugador(id, nombre_mostrar, sexo, lado_preferido)')
      .eq('competicion_id', idCompeticion)
      .eq('jugador_id', idJugador)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar el jugador.');
    return data ? mapearJugadorPlantilla(data) : null;
  }

  /** Ids de los comodines de una competición: no tienen ficha pública. */
  async obtenerIdsComodines(idCompeticion: string): Promise<ReadonlySet<string>> {
    const { data, error } = await this.supabase
      .from('plantilla')
      .select('jugador_id')
      .eq('competicion_id', idCompeticion)
      .eq('comodin', true);
    lanzarSiHayError(error, 'No se han podido cargar los comodines.');
    return new Set((data ?? []).map((fila) => fila.jugador_id));
  }
}
