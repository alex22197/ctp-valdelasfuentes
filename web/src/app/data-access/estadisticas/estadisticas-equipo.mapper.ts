import type { Tables } from '@core/supabase/interfaces/database.types';
import { mapearBalance } from './estadisticas-jugador.mapper';
import type { BalancePareja } from './interfaces/balance-pareja.interface';
import type { BalancePuestoEquipo } from './interfaces/balance-puesto-equipo.interface';
import type { ParticipacionJugador } from './interfaces/participacion-jugador.interface';
import type { PartidoDeJornada } from './interfaces/partido-de-jornada.interface';

// Como en el resto de vistas, una fila sin un dato clave se descarta.

type FilaBalance = Pick<
  Tables<'estadistica_puesto'>,
  'partidos' | 'ganados' | 'perdidos' | 'porcentaje_victorias'
>;

export type FilaPuestoEquipo = FilaBalance &
  Pick<Tables<'estadistica_puesto'>, 'tipo' | 'numero' | 'wo_a_favor' | 'wo_en_contra'>;

export type FilaParejaEquipo = FilaBalance &
  Pick<
    Tables<'estadistica_pareja'>,
    | 'tipo'
    | 'jugador_a_id'
    | 'jugador_a_nombre'
    | 'jugador_a_comodin'
    | 'jugador_b_id'
    | 'jugador_b_nombre'
    | 'jugador_b_comodin'
  >;

export type FilaParticipacion = Pick<
  Tables<'estadistica_participacion'>,
  | 'jugador_id'
  | 'nombre_mostrar'
  | 'confrontaciones'
  | 'jugadas'
  | 'disponible_sin_jugar'
  | 'no_disponible'
  | 'sin_responder'
  | 'porcentaje_jugadas'
>;

export type FilaPartidoResultado = Pick<
  Tables<'partido_resultado'>,
  'confrontacion_id' | 'tipo' | 'numero' | 'resultado' | 'ganado'
>;

export function mapearPuestosEquipo(filas: readonly FilaPuestoEquipo[]): BalancePuestoEquipo[] {
  return filas.flatMap((fila) =>
    fila.tipo && fila.numero !== null
      ? [
          {
            ...mapearBalance(fila),
            tipo: fila.tipo,
            numero: fila.numero,
            woAFavor: fila.wo_a_favor ?? 0,
            woEnContra: fila.wo_en_contra ?? 0,
          },
        ]
      : [],
  );
}

export function mapearParejas(filas: readonly FilaParejaEquipo[]): BalancePareja[] {
  return filas.flatMap((fila) =>
    fila.tipo &&
    fila.jugador_a_id &&
    fila.jugador_a_nombre &&
    fila.jugador_b_id &&
    fila.jugador_b_nombre
      ? [
          {
            ...mapearBalance(fila),
            tipo: fila.tipo,
            jugadorA: {
              id: fila.jugador_a_id,
              nombreMostrar: fila.jugador_a_nombre,
              comodin: fila.jugador_a_comodin ?? false,
            },
            jugadorB: {
              id: fila.jugador_b_id,
              nombreMostrar: fila.jugador_b_nombre,
              comodin: fila.jugador_b_comodin ?? false,
            },
          },
        ]
      : [],
  );
}

export function mapearParticipacion(filas: readonly FilaParticipacion[]): ParticipacionJugador[] {
  return filas.flatMap((fila) =>
    fila.jugador_id && fila.nombre_mostrar
      ? [
          {
            id: fila.jugador_id,
            nombreMostrar: fila.nombre_mostrar,
            confrontaciones: fila.confrontaciones ?? 0,
            jugadas: fila.jugadas ?? 0,
            disponibleSinJugar: fila.disponible_sin_jugar ?? 0,
            noDisponible: fila.no_disponible ?? 0,
            sinResponder: fila.sin_responder ?? 0,
            porcentajeJugadas: fila.porcentaje_jugadas,
          },
        ]
      : [],
  );
}

export function mapearPartidosDeJornada(
  filas: readonly FilaPartidoResultado[],
): PartidoDeJornada[] {
  return filas.flatMap((fila) =>
    fila.confrontacion_id && fila.tipo && fila.numero !== null
      ? [
          {
            confrontacionId: fila.confrontacion_id,
            tipo: fila.tipo,
            numero: fila.numero,
            resultado: fila.resultado,
            ganado: fila.ganado,
          },
        ]
      : [],
  );
}
