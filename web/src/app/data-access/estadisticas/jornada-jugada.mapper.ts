import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JornadaJugada } from './interfaces/jornada-jugada.interface';

export type FilaJornada = Pick<
  Tables<'estadistica_jornada'>,
  | 'confrontacion_id'
  | 'fase_nombre'
  | 'fase_orden'
  | 'jornada'
  | 'rival_nombre'
  | 'condicion'
  | 'partidos_ganados'
  | 'partidos_perdidos'
>;

/** Las jornadas jugadas; una fila sin confrontación, fase o rival se descarta. */
export function mapearJornadasJugadas(filas: readonly FilaJornada[]): JornadaJugada[] {
  return filas.flatMap((fila) =>
    fila.confrontacion_id && fila.fase_nombre && fila.fase_orden !== null && fila.rival_nombre
      ? [
          {
            confrontacionId: fila.confrontacion_id,
            faseNombre: fila.fase_nombre,
            faseOrden: fila.fase_orden,
            jornada: fila.jornada,
            rival: fila.rival_nombre,
            condicion: fila.condicion === 'local' ? 'local' : 'visitante',
            partidosGanados: fila.partidos_ganados ?? 0,
            partidosPerdidos: fila.partidos_perdidos ?? 0,
          },
        ]
      : [],
  );
}
