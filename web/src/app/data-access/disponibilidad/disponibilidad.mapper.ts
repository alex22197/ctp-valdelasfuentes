import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorEncuesta } from './interfaces/jugador-encuesta.interface';

export type FilaPlantillaEncuesta = Pick<Tables<'plantilla'>, 'comodin' | 'baja'> & {
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
  const porJugador = new Map(disponibilidad.map((fila) => [fila.jugador_id, fila]));
  return plantilla
    .filter((fila) => !fila.comodin && (fila.baja === null || fila.baja > hoy))
    .map(({ jugador }) => {
      const fila = porJugador.get(jugador.id);
      return {
        id: jugador.id,
        nombreMostrar: jugador.nombre_mostrar,
        sexo: jugador.sexo,
        respuesta: fila?.respuesta ?? null,
        convocado: fila?.convocado ?? false,
      };
    });
}
