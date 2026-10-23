import type { Tables } from '@core/supabase/interfaces/database.types';
import { mapearEquipoResumen } from '@data-access/equipos/equipo.mapper';
import type { FilaClasificacion } from './interfaces/fila-clasificacion.interface';

type FilaFaseEquipo = Pick<
  Tables<'fase_equipo'>,
  | 'posicion'
  | 'puntos'
  | 'ganados'
  | 'empatados'
  | 'perdidos'
  | 'partidos_favor'
  | 'partidos_contra'
  | 'actualizado_en'
> & { equipo: Pick<Tables<'equipo'>, 'id' | 'nombre' | 'es_nuestro'> };

export function mapearFilaClasificacion(fila: FilaFaseEquipo): FilaClasificacion {
  return {
    posicion: fila.posicion,
    equipo: mapearEquipoResumen(fila.equipo),
    puntos: fila.puntos,
    ganados: fila.ganados,
    empatados: fila.empatados,
    perdidos: fila.perdidos,
    partidosFavor: fila.partidos_favor,
    partidosContra: fila.partidos_contra,
    actualizadaEn: fila.actualizado_en,
  };
}
