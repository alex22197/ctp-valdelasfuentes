import type { Tables } from '@core/supabase/interfaces/database.types';
import { type FilaResumenJugador, mapearResumenJugador } from './estadisticas-jugador.mapper';
import type { ResumenJugador } from './interfaces/resumen-jugador.interface';

export type FilaResumenConJugador = FilaResumenJugador &
  Pick<Tables<'estadistica_jugador'>, 'jugador_id'>;

/** Resumen de cada jugador por su id; las filas sin jugador se descartan. */
export function mapearResumenesPorJugador(
  filas: readonly FilaResumenConJugador[],
): ReadonlyMap<string, ResumenJugador> {
  return new Map(
    filas.flatMap((fila) =>
      fila.jugador_id ? [[fila.jugador_id, mapearResumenJugador(fila)] as const] : [],
    ),
  );
}
