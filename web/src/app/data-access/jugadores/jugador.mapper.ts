import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorPlantilla } from './interfaces/jugador-plantilla.interface';

export type FilaPlantilla = Pick<Tables<'plantilla'>, 'comodin'> & {
  jugador: Pick<Tables<'jugador'>, 'id' | 'nombre_mostrar' | 'sexo' | 'lado_preferido'>;
};

export function mapearJugadorPlantilla(fila: FilaPlantilla): JugadorPlantilla {
  return {
    id: fila.jugador.id,
    nombreMostrar: fila.jugador.nombre_mostrar,
    sexo: fila.jugador.sexo,
    ladoPreferido: fila.jugador.lado_preferido,
    comodin: fila.comodin,
  };
}
