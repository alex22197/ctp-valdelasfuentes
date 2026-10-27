import type { Tables } from '@core/supabase/interfaces/database.types';
import type { PartidoEquipo } from './interfaces/partido-equipo.interface';

export type FilaPartidoEquipo = Pick<
  Tables<'estadistica_partido_equipo'>,
  | 'confrontacion_id'
  | 'fase_id'
  | 'jornada'
  | 'condicion'
  | 'tipo'
  | 'numero'
  | 'ganado'
  | 'es_wo'
  | 'sets_jugados'
  | 'sets_ganados'
  | 'sets_perdidos'
  | 'tiebreaks_jugados'
  | 'tiebreaks_ganados'
>;

/** Como en el resto de vistas, una fila sin un dato clave se descarta. */
export function mapearPartidosEquipo(filas: readonly FilaPartidoEquipo[]): PartidoEquipo[] {
  return filas.flatMap((fila) =>
    fila.confrontacion_id &&
    fila.fase_id &&
    fila.tipo &&
    fila.numero !== null &&
    fila.ganado !== null &&
    (fila.condicion === 'local' || fila.condicion === 'visitante')
      ? [
          {
            confrontacionId: fila.confrontacion_id,
            faseId: fila.fase_id,
            jornada: fila.jornada,
            condicion: fila.condicion,
            tipo: fila.tipo,
            numero: fila.numero,
            ganado: fila.ganado,
            esWo: fila.es_wo ?? false,
            setsJugados: fila.sets_jugados ?? 0,
            setsGanados: fila.sets_ganados ?? 0,
            setsPerdidos: fila.sets_perdidos ?? 0,
            tiebreaksJugados: fila.tiebreaks_jugados ?? 0,
            tiebreaksGanados: fila.tiebreaks_ganados ?? 0,
          },
        ]
      : [],
  );
}
