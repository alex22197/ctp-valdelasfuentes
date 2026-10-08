import type { Tables } from '@core/supabase/interfaces/database.types';
import { mapearEquipoResumen } from '@data-access/equipos/equipo.mapper';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { MarcadorConfrontacion } from './interfaces/marcador-confrontacion.interface';

type FilaEquipo = Pick<Tables<'equipo'>, 'id' | 'nombre' | 'es_nuestro'>;

export type FilaConfrontacion = Pick<
  Tables<'confrontacion'>,
  | 'id'
  | 'jornada'
  | 'estado'
  | 'fecha_prevista'
  | 'fecha_hora'
  | 'sede'
  | 'num_pistas'
  | 'partidos_local'
  | 'partidos_visitante'
> & { local: FilaEquipo; visitante: FilaEquipo };

/**
 * Convierte una confrontación al punto de vista de nuestro equipo.
 * Devuelve `null` si nuestro equipo no juega en ella.
 */
export function mapearConfrontacionNuestroEquipo(
  fila: FilaConfrontacion,
): ConfrontacionNuestroEquipo | null {
  const local = mapearEquipoResumen(fila.local);
  const visitante = mapearEquipoResumen(fila.visitante);
  if (!local.esNuestro && !visitante.esNuestro) {
    return null;
  }

  const jugamosEnCasa = local.esNuestro;
  return {
    id: fila.id,
    jornada: fila.jornada,
    local,
    visitante,
    rival: jugamosEnCasa ? visitante : local,
    condicion: jugamosEnCasa ? 'local' : 'visitante',
    estado: fila.estado,
    fechaPrevista: fila.fecha_prevista,
    fechaHora: fila.fecha_hora,
    sede: fila.sede,
    numeroPistas: fila.num_pistas,
    marcador: mapearMarcador(fila, jugamosEnCasa),
  };
}

function mapearMarcador(
  fila: FilaConfrontacion,
  jugamosEnCasa: boolean,
): MarcadorConfrontacion | null {
  if (fila.partidos_local === null || fila.partidos_visitante === null) {
    return null;
  }
  return jugamosEnCasa
    ? { nuestros: fila.partidos_local, rival: fila.partidos_visitante }
    : { nuestros: fila.partidos_visitante, rival: fila.partidos_local };
}
