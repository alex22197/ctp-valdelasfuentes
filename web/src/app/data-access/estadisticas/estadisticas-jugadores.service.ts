import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import type { EstadisticaJugador } from './interfaces/estadistica-jugador.interface';
import type { LadosJugador } from './interfaces/lados-jugador.interface';
import { mapearEstadisticasJugadores, mapearLadosJugadores } from './jugadores-equipo.mapper';

const MENSAJE_ERROR = 'No se han podido cargar las estadísticas de los jugadores.';

/**
 * Estadísticas de todos los jugadores a la vez, para comparar en la página de estadísticas.
 * `idFase` elige una fase; `null` es la competición entera (`toda_la_competicion`).
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasJugadoresService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Resumen de cada jugador que ha jugado. */
  async obtenerJugadores(
    idCompeticion: string,
    idFase: string | null,
  ): Promise<EstadisticaJugador[]> {
    const consulta = this.supabase
      .from('estadistica_jugador')
      .select(
        'jugador_id, nombre_mostrar, comodin, partidos, ganados, perdidos, porcentaje_victorias, sets_ganados, sets_perdidos, juegos_ganados, juegos_perdidos, jornadas, wo_a_favor',
      )
      .eq('competicion_id', idCompeticion);
    const { data, error } = await (idFase
      ? consulta.eq('fase_id', idFase)
      : consulta.eq('toda_la_competicion', true));
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearEstadisticasJugadores(data ?? []);
  }

  /** Partidos de revés y de drive de cada jugador que ha jugado. */
  async obtenerLados(idCompeticion: string, idFase: string | null): Promise<LadosJugador[]> {
    const consulta = this.supabase
      .from('estadistica_jugador_lado')
      .select(
        'jugador_id, nombre_mostrar, comodin, lado, partidos, ganados, perdidos, porcentaje_victorias',
      )
      .eq('competicion_id', idCompeticion);
    const { data, error } = await (idFase
      ? consulta.eq('fase_id', idFase)
      : consulta.eq('toda_la_competicion', true));
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearLadosJugadores(data ?? []);
  }
}
