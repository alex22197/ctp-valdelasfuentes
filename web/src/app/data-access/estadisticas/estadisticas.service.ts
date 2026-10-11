import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import {
  mapearBalancesLado,
  mapearBalancesPuesto,
  mapearCompaneros,
  mapearPartidosDeJugador,
  mapearResumenJugador,
} from './estadisticas-jugador.mapper';
import { mapearJornadasJugadas } from './jornada-jugada.mapper';
import type { EstadisticasJugador } from './interfaces/estadisticas-jugador.interface';
import type { JornadaJugada } from './interfaces/jornada-jugada.interface';

const COLUMNAS_BALANCE = 'partidos, ganados, perdidos, porcentaje_victorias';
const MENSAJE_ERROR = 'No se han podido cargar las estadísticas.';

/**
 * Estadísticas ya calculadas por las vistas `estadistica_*` de la base de datos: aquí solo
 * se leen. Todas son de la competición entera (`toda_la_competicion`).
 */
@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Lo que enseña la ficha de un jugador: totales, lados, puestos, compañeros y partidos. */
  async obtenerEstadisticasJugador(
    idCompeticion: string,
    idJugador: string,
  ): Promise<EstadisticasJugador> {
    const [resumen, lados, puestos, parejas, partidos] = await Promise.all([
      this.supabase
        .from('estadistica_jugador')
        .select(
          `${COLUMNAS_BALANCE}, sets_ganados, sets_perdidos, juegos_ganados, juegos_perdidos, jornadas, wo_a_favor`,
        )
        .eq('competicion_id', idCompeticion)
        .eq('toda_la_competicion', true)
        .eq('jugador_id', idJugador)
        .maybeSingle(),
      this.supabase
        .from('estadistica_jugador_lado')
        .select(`${COLUMNAS_BALANCE}, lado`)
        .eq('competicion_id', idCompeticion)
        .eq('toda_la_competicion', true)
        .eq('jugador_id', idJugador)
        .order('lado'),
      this.supabase
        .from('estadistica_jugador_puesto')
        .select(`${COLUMNAS_BALANCE}, tipo, numero`)
        .eq('competicion_id', idCompeticion)
        .eq('toda_la_competicion', true)
        .eq('jugador_id', idJugador)
        .order('tipo')
        .order('numero'),
      this.supabase
        .from('estadistica_pareja')
        .select(
          `${COLUMNAS_BALANCE}, jugador_a_id, jugador_a_nombre, jugador_a_comodin, jugador_b_id, jugador_b_nombre, jugador_b_comodin`,
        )
        .eq('competicion_id', idCompeticion)
        .eq('toda_la_competicion', true)
        .or(`jugador_a_id.eq.${idJugador},jugador_b_id.eq.${idJugador}`)
        .order('partidos', { ascending: false })
        .order('porcentaje_victorias', { ascending: false }),
      this.supabase
        .from('estadistica_partido_jugador')
        .select(
          'confrontacion_id, tipo, numero, lado, ganado, es_wo, marcador, companero_id, companero_nombre',
        )
        .eq('competicion_id', idCompeticion)
        .eq('jugador_id', idJugador),
    ]);
    for (const { error } of [resumen, lados, puestos, parejas, partidos]) {
      lanzarSiHayError(error, MENSAJE_ERROR);
    }

    return {
      resumen: resumen.data ? mapearResumenJugador(resumen.data) : null,
      lados: mapearBalancesLado(lados.data ?? []),
      puestos: mapearBalancesPuesto(puestos.data ?? []),
      companeros: mapearCompaneros(parejas.data ?? [], idJugador),
      partidos: mapearPartidosDeJugador(partidos.data ?? []),
    };
  }

  /** Confrontaciones nuestras ya jugadas, por fase y jornada. */
  async obtenerJornadasJugadas(idCompeticion: string): Promise<JornadaJugada[]> {
    const { data, error } = await this.supabase
      .from('estadistica_jornada')
      .select(
        'confrontacion_id, fase_nombre, fase_orden, jornada, rival_nombre, condicion, partidos_ganados, partidos_perdidos',
      )
      .eq('competicion_id', idCompeticion)
      .order('fase_orden')
      .order('jornada', { nullsFirst: false })
      .order('fecha_prevista', { nullsFirst: false });
    lanzarSiHayError(error, MENSAJE_ERROR);
    return mapearJornadasJugadas(data ?? []);
  }
}
