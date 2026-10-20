import type { Database, Tables } from '@core/supabase/interfaces/database.types';
import { type FilaParticipacion, jugadorEnLado } from '@data-access/alineaciones/alineacion.mapper';
import type { MarcadorPartido } from './interfaces/marcador-partido.interface';
import type { PartidoConResultado } from './interfaces/partido-con-resultado.interface';
import type { SetPartido } from './interfaces/set-partido.interface';

export type FilaSet = Pick<
  Tables<'set_partido'>,
  'numero' | 'juegos_nuestros' | 'juegos_rival' | 'tiebreak_nuestros' | 'tiebreak_rival'
>;

export type FilaPartidoResultado = Pick<
  Tables<'partido'>,
  'tipo' | 'numero' | 'resultado' | 'ganado'
> & {
  set_partido: FilaSet[];
  participacion: FilaParticipacion[];
};

type ParametrosGuardarResultado = Pick<
  Database['public']['Functions']['guardar_resultado_partido']['Args'],
  'p_sets' | 'p_resultado' | 'p_ganado'
>;

export function mapearPartidoConResultado(fila: FilaPartidoResultado): PartidoConResultado {
  return {
    tipo: fila.tipo,
    numero: fila.numero,
    reves: jugadorEnLado(fila.participacion, 'reves'),
    drive: jugadorEnLado(fila.participacion, 'drive'),
    marcador: {
      resultado: fila.resultado,
      ganado: fila.ganado,
      sets: [...fila.set_partido].sort((a, b) => a.numero - b.numero).map(mapearSet),
    },
  };
}

/**
 * Parámetros de `guardar_resultado_partido` para un marcador. El resultado y el ganador se
 * omiten cuando están vacíos: la función los toma entonces como `null`.
 */
export function mapearParametrosGuardarResultado(
  marcador: MarcadorPartido,
): ParametrosGuardarResultado {
  return {
    p_sets: marcador.sets.map((set) => ({
      juegos_nuestros: set.juegosNuestros,
      juegos_rival: set.juegosRival,
      tiebreak_nuestros: set.tiebreakNuestros,
      tiebreak_rival: set.tiebreakRival,
    })),
    ...(marcador.resultado === null ? {} : { p_resultado: marcador.resultado }),
    ...(marcador.ganado === null ? {} : { p_ganado: marcador.ganado }),
  };
}

export function mapearSet(fila: FilaSet): SetPartido {
  return {
    juegosNuestros: fila.juegos_nuestros,
    juegosRival: fila.juegos_rival,
    tiebreakNuestros: fila.tiebreak_nuestros,
    tiebreakRival: fila.tiebreak_rival,
  };
}
