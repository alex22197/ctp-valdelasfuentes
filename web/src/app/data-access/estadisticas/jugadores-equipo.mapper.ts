import type { Tables } from '@core/supabase/interfaces/database.types';
import {
  type FilaResumenJugador,
  mapearBalance,
  mapearResumenJugador,
} from './estadisticas-jugador.mapper';
import type { EstadisticaJugador } from './interfaces/estadistica-jugador.interface';
import type { LadosJugador } from './interfaces/lados-jugador.interface';

export type FilaEstadisticaJugador = FilaResumenJugador &
  Pick<Tables<'estadistica_jugador'>, 'jugador_id' | 'nombre_mostrar' | 'comodin'>;

export type FilaLadoJugador = Pick<
  Tables<'estadistica_jugador_lado'>,
  | 'jugador_id'
  | 'nombre_mostrar'
  | 'comodin'
  | 'lado'
  | 'partidos'
  | 'ganados'
  | 'perdidos'
  | 'porcentaje_victorias'
>;

const SIN_PARTIDOS = { partidos: 0, ganados: 0, perdidos: 0, porcentajeVictorias: null };

export function mapearEstadisticasJugadores(
  filas: readonly FilaEstadisticaJugador[],
): EstadisticaJugador[] {
  return filas.flatMap((fila) =>
    fila.jugador_id && fila.nombre_mostrar
      ? [
          {
            ...mapearResumenJugador(fila),
            id: fila.jugador_id,
            nombreMostrar: fila.nombre_mostrar,
            comodin: fila.comodin ?? false,
          },
        ]
      : [],
  );
}

/** Junta las dos filas (revés y drive) de cada jugador; el lado que falte queda a cero. */
export function mapearLadosJugadores(filas: readonly FilaLadoJugador[]): LadosJugador[] {
  const porJugador = new Map<string, LadosJugador>();
  for (const fila of filas) {
    if (!fila.jugador_id || !fila.nombre_mostrar || !fila.lado) {
      continue;
    }
    const anterior = porJugador.get(fila.jugador_id) ?? {
      id: fila.jugador_id,
      nombreMostrar: fila.nombre_mostrar,
      comodin: fila.comodin ?? false,
      reves: SIN_PARTIDOS,
      drive: SIN_PARTIDOS,
    };
    porJugador.set(fila.jugador_id, { ...anterior, [fila.lado]: mapearBalance(fila) });
  }
  return [...porJugador.values()];
}
