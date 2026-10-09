import type { Tables } from '@core/supabase/interfaces/database.types';
import type { EquipoResumen } from './interfaces/equipo-resumen.interface';

type FilaEquipo = Pick<Tables<'equipo'>, 'id' | 'nombre' | 'es_nuestro'>;

export function mapearEquipoResumen(fila: FilaEquipo): EquipoResumen {
  return { id: fila.id, nombre: fila.nombre, esNuestro: fila.es_nuestro };
}
