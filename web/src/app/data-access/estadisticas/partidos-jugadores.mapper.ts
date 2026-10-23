import type { Tables } from '@core/supabase/interfaces/database.types';
import type { PartidoJugadorEquipo } from './interfaces/partido-jugador-equipo.interface';

export type FilaPartidoJugadorEquipo = Pick<
  Tables<'estadistica_partido_jugador'>,
  | 'jugador_id'
  | 'nombre_mostrar'
  | 'comodin'
  | 'confrontacion_id'
  | 'tipo'
  | 'numero'
  | 'lado'
  | 'ganado'
  | 'es_wo'
  | 'marcador'
  | 'companero_nombre'
>;

/** Como en el resto de vistas, una fila sin un dato clave se descarta. */
export function mapearPartidosJugadores(
  filas: readonly FilaPartidoJugadorEquipo[],
): PartidoJugadorEquipo[] {
  return filas.flatMap((fila) =>
    fila.jugador_id &&
    fila.nombre_mostrar &&
    fila.confrontacion_id &&
    fila.tipo &&
    fila.numero !== null &&
    fila.lado &&
    fila.ganado !== null
      ? [
          {
            jugador: {
              id: fila.jugador_id,
              nombreMostrar: fila.nombre_mostrar,
              comodin: fila.comodin ?? false,
            },
            confrontacionId: fila.confrontacion_id,
            tipo: fila.tipo,
            numero: fila.numero,
            lado: fila.lado,
            ganado: fila.ganado,
            esWo: fila.es_wo ?? false,
            marcador: fila.marcador,
            companero: fila.companero_nombre,
          },
        ]
      : [],
  );
}
