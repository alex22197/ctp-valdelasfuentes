import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorGestion } from './interfaces/jugador-gestion.interface';

type FilaPrivada = Pick<Tables<'jugador_privado'>, 'nombre_completo'>;

/** La fila de `plantilla` con el jugador y, si lo tiene, su nombre completo. */
export type FilaPlantillaGestion = Pick<
  Tables<'plantilla'>,
  'comodin' | 'inscrito_oficial' | 'baja'
> & {
  jugador: Pick<Tables<'jugador'>, 'id' | 'nombre_mostrar' | 'sexo' | 'lado_preferido'> & {
    /** Uno a uno: PostgREST lo da como objeto, pero por si acaso se admite también en lista. */
    jugador_privado?: FilaPrivada | readonly FilaPrivada[] | null;
  };
};

export function mapearJugadorGestion(fila: FilaPlantillaGestion): JugadorGestion {
  const privado = Array.isArray(fila.jugador.jugador_privado)
    ? (fila.jugador.jugador_privado[0] ?? null)
    : (fila.jugador.jugador_privado as FilaPrivada | null);
  return {
    id: fila.jugador.id,
    nombreMostrar: fila.jugador.nombre_mostrar,
    nombreCompleto: privado?.nombre_completo ?? null,
    sexo: fila.jugador.sexo,
    ladoPreferido: fila.jugador.lado_preferido,
    comodin: fila.comodin,
    inscritoOficial: fila.inscrito_oficial,
    baja: fila.baja,
  };
}
