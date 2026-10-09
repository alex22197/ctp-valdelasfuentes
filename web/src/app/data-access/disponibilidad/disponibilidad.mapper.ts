import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorConvocable } from './interfaces/jugador-convocable.interface';
import type { JugadorEncuesta } from './interfaces/jugador-encuesta.interface';

export type FilaPlantillaEncuesta = Pick<
  Tables<'plantilla'>,
  'comodin' | 'baja' | 'inscrito_oficial'
> & {
  jugador: Pick<Tables<'jugador'>, 'id' | 'nombre_mostrar' | 'sexo'>;
};

export type FilaDisponibilidad = Pick<
  Tables<'disponibilidad'>,
  'jugador_id' | 'respuesta' | 'convocado'
>;

/**
 * Jugadores a los que se pregunta en la encuesta de una jornada, con su respuesta.
 * Quedan fuera los comodines (no están en la encuesta) y quien ya se dio de baja en
 * `hoy` (AAAA-MM-DD). Sin fila de disponibilidad = sin responder.
 */
export function mapearListaEncuesta(
  plantilla: readonly FilaPlantillaEncuesta[],
  disponibilidad: readonly FilaDisponibilidad[],
  hoy: string,
): JugadorEncuesta[] {
  return mapearConvocables(plantilla, disponibilidad, hoy).filter((jugador) => !jugador.comodin);
}

/**
 * Jugadores que se pueden convocar en una jornada: la plantilla y los comodines, con su
 * respuesta a la encuesta. Quien se dio de baja queda fuera, salvo que ya esté convocado.
 */
export function mapearConvocables(
  plantilla: readonly FilaPlantillaEncuesta[],
  disponibilidad: readonly FilaDisponibilidad[],
  hoy: string,
): JugadorConvocable[] {
  const porJugador = new Map(disponibilidad.map((fila) => [fila.jugador_id, fila]));
  return plantilla
    .map((fila) => {
      const respuesta = porJugador.get(fila.jugador.id);
      return {
        fila,
        jugador: {
          id: fila.jugador.id,
          nombreMostrar: fila.jugador.nombre_mostrar,
          sexo: fila.jugador.sexo,
          respuesta: respuesta?.respuesta ?? null,
          convocado: respuesta?.convocado ?? false,
          comodin: fila.comodin,
          inscritoOficial: fila.inscrito_oficial,
        },
      };
    })
    .filter(({ fila, jugador }) => jugador.convocado || fila.baja === null || fila.baja > hoy)
    .map(({ jugador }) => jugador);
}
