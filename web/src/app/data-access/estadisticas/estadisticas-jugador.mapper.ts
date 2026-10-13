import type { Tables } from '@core/supabase/interfaces/database.types';
import type { BalanceCompanero } from './interfaces/balance-companero.interface';
import type { BalanceLado } from './interfaces/balance-lado.interface';
import type { BalancePartidos } from './interfaces/balance-partidos.interface';
import type { BalancePuesto } from './interfaces/balance-puesto.interface';
import type { PartidoDeJugador } from './interfaces/partido-de-jugador.interface';
import type { ResumenJugador } from './interfaces/resumen-jugador.interface';

// Los tipos generados marcan como opcional toda columna de una vista. Las vistas siempre
// las rellenan; aun así, una fila sin un dato clave se descarta en lugar de romper la ficha.

type FilaBalance = Pick<
  Tables<'estadistica_jugador_lado'>,
  'partidos' | 'ganados' | 'perdidos' | 'porcentaje_victorias'
>;

export type FilaResumenJugador = FilaBalance &
  Pick<
    Tables<'estadistica_jugador'>,
    | 'sets_ganados'
    | 'sets_perdidos'
    | 'juegos_ganados'
    | 'juegos_perdidos'
    | 'jornadas'
    | 'wo_a_favor'
  >;

export type FilaBalanceLado = FilaBalance & Pick<Tables<'estadistica_jugador_lado'>, 'lado'>;

export type FilaBalancePuesto = FilaBalance &
  Pick<Tables<'estadistica_jugador_puesto'>, 'tipo' | 'numero'>;

export type FilaPareja = FilaBalance &
  Pick<
    Tables<'estadistica_pareja'>,
    | 'jugador_a_id'
    | 'jugador_a_nombre'
    | 'jugador_a_comodin'
    | 'jugador_b_id'
    | 'jugador_b_nombre'
    | 'jugador_b_comodin'
  >;

export type FilaPartidoJugador = Pick<
  Tables<'estadistica_partido_jugador'>,
  | 'confrontacion_id'
  | 'tipo'
  | 'numero'
  | 'lado'
  | 'ganado'
  | 'es_wo'
  | 'marcador'
  | 'juegos_ganados'
  | 'juegos_perdidos'
  | 'companero_id'
  | 'companero_nombre'
>;

export function mapearBalance(fila: FilaBalance): BalancePartidos {
  return {
    partidos: fila.partidos ?? 0,
    ganados: fila.ganados ?? 0,
    perdidos: fila.perdidos ?? 0,
    porcentajeVictorias: fila.porcentaje_victorias,
  };
}

export function mapearResumenJugador(fila: FilaResumenJugador): ResumenJugador {
  return {
    ...mapearBalance(fila),
    setsGanados: fila.sets_ganados ?? 0,
    setsPerdidos: fila.sets_perdidos ?? 0,
    juegosGanados: fila.juegos_ganados ?? 0,
    juegosPerdidos: fila.juegos_perdidos ?? 0,
    jornadas: fila.jornadas ?? 0,
    woAFavor: fila.wo_a_favor ?? 0,
  };
}

export function mapearBalancesLado(filas: readonly FilaBalanceLado[]): BalanceLado[] {
  return filas.flatMap((fila) => (fila.lado ? [{ ...mapearBalance(fila), lado: fila.lado }] : []));
}

export function mapearBalancesPuesto(filas: readonly FilaBalancePuesto[]): BalancePuesto[] {
  return filas.flatMap((fila) =>
    fila.tipo && fila.numero !== null
      ? [{ ...mapearBalance(fila), tipo: fila.tipo, numero: fila.numero }]
      : [],
  );
}

/** Cada pareja de la vista, vista desde un jugador: el compañero es el otro. */
export function mapearCompaneros(
  filas: readonly FilaPareja[],
  idJugador: string,
): BalanceCompanero[] {
  return filas.flatMap((fila) => {
    const esA = fila.jugador_a_id === idJugador;
    const id = esA ? fila.jugador_b_id : fila.jugador_a_id;
    const nombre = esA ? fila.jugador_b_nombre : fila.jugador_a_nombre;
    const comodin = esA ? fila.jugador_b_comodin : fila.jugador_a_comodin;
    return id && nombre
      ? [{ ...mapearBalance(fila), id, nombreMostrar: nombre, comodin: comodin ?? false }]
      : [];
  });
}

export function mapearPartidosDeJugador(filas: readonly FilaPartidoJugador[]): PartidoDeJugador[] {
  return filas.flatMap((fila) =>
    fila.confrontacion_id && fila.tipo && fila.numero !== null && fila.lado && fila.ganado !== null
      ? [
          {
            confrontacionId: fila.confrontacion_id,
            tipo: fila.tipo,
            numero: fila.numero,
            lado: fila.lado,
            ganado: fila.ganado,
            esWo: fila.es_wo ?? false,
            marcador: fila.marcador,
            juegosGanados: fila.juegos_ganados ?? 0,
            juegosPerdidos: fila.juegos_perdidos ?? 0,
            companero:
              fila.companero_id && fila.companero_nombre
                ? { id: fila.companero_id, nombreMostrar: fila.companero_nombre }
                : null,
          },
        ]
      : [],
  );
}
