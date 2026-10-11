import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import {
  mapearParejas,
  mapearParticipacion,
  mapearPartidosDeJornada,
  mapearPuestosEquipo,
} from './estadisticas-equipo.mapper';
import type { BalancePareja } from './interfaces/balance-pareja.interface';
import type { BalancePuestoEquipo } from './interfaces/balance-puesto-equipo.interface';
import type { ParticipacionJugador } from './interfaces/participacion-jugador.interface';
import type { PartidoDeJornada } from './interfaces/partido-de-jornada.interface';

const MENSAJE_ERROR = 'No se han podido cargar las estadísticas.';

/**
 * Estadísticas del equipo para la página de estadísticas, ya calculadas en las vistas.
 * `idFase` elige una fase; `null` es la competición entera (`toda_la_competicion`).
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasEquipoService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Porcentaje de victorias del equipo en cada puesto, con los WO. */
  async obtenerPuestos(
    idCompeticion: string,
    idFase: string | null,
  ): Promise<BalancePuestoEquipo[]> {
    const consulta = this.supabase
      .from('estadistica_puesto')
      .select(
        'partidos, ganados, perdidos, porcentaje_victorias, tipo, numero, wo_a_favor, wo_en_contra',
      )
      .eq('competicion_id', idCompeticion)
      .order('tipo')
      .order('numero');
    const { data, error } = await (idFase
      ? consulta.eq('fase_id', idFase)
      : consulta.eq('toda_la_competicion', true));
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearPuestosEquipo(data ?? []);
  }

  /** Todas las parejas que han jugado, de más a menos partidos juntos. */
  async obtenerParejas(idCompeticion: string, idFase: string | null): Promise<BalancePareja[]> {
    const consulta = this.supabase
      .from('estadistica_pareja')
      .select(
        'partidos, ganados, perdidos, porcentaje_victorias, tipo, jugador_a_id, jugador_a_nombre, jugador_a_comodin, jugador_b_id, jugador_b_nombre, jugador_b_comodin',
      )
      .eq('competicion_id', idCompeticion)
      .order('partidos', { ascending: false })
      .order('porcentaje_victorias', { ascending: false });
    const { data, error } = await (idFase
      ? consulta.eq('fase_id', idFase)
      : consulta.eq('toda_la_competicion', true));
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearParejas(data ?? []);
  }

  /** Participación de cada jugador. Solo responde a los gestores (RLS y la propia vista). */
  async obtenerParticipacion(
    idCompeticion: string,
    idFase: string | null,
  ): Promise<ParticipacionJugador[]> {
    const consulta = this.supabase
      .from('estadistica_participacion')
      .select(
        'jugador_id, nombre_mostrar, confrontaciones, jugadas, disponible_sin_jugar, no_disponible, sin_responder, porcentaje_jugadas',
      )
      .eq('competicion_id', idCompeticion)
      .order('jugadas', { ascending: false })
      .order('nombre_mostrar');
    const { data, error } = await (idFase
      ? consulta.eq('fase_id', idFase)
      : consulta.eq('toda_la_competicion', true));
    lanzarSiHayError(error, 'No se ha podido cargar la participación.');
    return mapearParticipacion(data ?? []);
  }

  /** Resultado de cada partido de las confrontaciones indicadas. */
  async obtenerPartidosDeJornadas(
    idsConfrontacion: readonly string[],
  ): Promise<PartidoDeJornada[]> {
    if (idsConfrontacion.length === 0) {
      return [];
    }
    const { data, error } = await this.supabase
      .from('partido_resultado')
      .select('confrontacion_id, tipo, numero, resultado, ganado')
      .in('confrontacion_id', [...idsConfrontacion]);
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearPartidosDeJornada(data ?? []);
  }
}
