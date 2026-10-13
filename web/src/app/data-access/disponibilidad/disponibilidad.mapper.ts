import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorConvocable } from './interfaces/jugador-convocable.interface';

export type FilaPlantillaConvocable = Pick<
  Tables<'plantilla'>,
  'comodin' | 'baja' | 'inscrito_oficial'
> & {
  jugador: Pick<Tables<'jugador'>, 'id' | 'nombre_mostrar' | 'sexo'>;
};

export type FilaDisponibilidad = Pick<Tables<'disponibilidad'>, 'jugador_id' | 'convocado'>;

/**
 * Jugadores que se pueden convocar en una jornada: la plantilla y los comodines, marcando
 * quién está ya convocado. Quien se dio de baja en `hoy` (AAAA-MM-DD) queda fuera, salvo
 * que ya esté convocado.
 */
export function mapearConvocables(
  plantilla: readonly FilaPlantillaConvocable[],
  disponibilidad: readonly FilaDisponibilidad[],
  hoy: string,
): JugadorConvocable[] {
  const convocados = new Set(disponibilidad.filter((f) => f.convocado).map((f) => f.jugador_id));
  return plantilla
    .map((fila) => ({
      fila,
      jugador: {
        id: fila.jugador.id,
        nombreMostrar: fila.jugador.nombre_mostrar,
        sexo: fila.jugador.sexo,
        convocado: convocados.has(fila.jugador.id),
        comodin: fila.comodin,
        inscritoOficial: fila.inscrito_oficial,
      },
    }))
    .filter(({ fila, jugador }) => jugador.convocado || fila.baja === null || fila.baja > hoy)
    .map(({ jugador }) => jugador);
}
