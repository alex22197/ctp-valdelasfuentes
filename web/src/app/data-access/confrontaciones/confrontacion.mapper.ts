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
  | 'convocatoria_publicada'
> & { local: FilaEquipo; visitante: FilaEquipo };

export type FilaMarcadorCalculado = Pick<
  Tables<'confrontacion_marcador'>,
  'partidos_ganados' | 'partidos_perdidos' | 'partidos_pendientes'
>;

/**
 * Convierte una confrontación al punto de vista de nuestro equipo.
 * Devuelve `null` si nuestro equipo no juega en ella.
 *
 * El marcador sale de nuestros partidos (vista `confrontacion_marcador`) cuando todos tienen
 * ganador; si no, del que trae el scraper de la web de la liga (ADR 0008).
 */
export function mapearConfrontacionNuestroEquipo(
  fila: FilaConfrontacion,
  marcadorCalculado: FilaMarcadorCalculado | null = null,
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
    convocatoriaPublicada: fila.convocatoria_publicada,
    marcador: mapearMarcadorCalculado(marcadorCalculado) ?? mapearMarcadorLiga(fila, jugamosEnCasa),
  };
}

function mapearMarcadorCalculado(
  calculado: FilaMarcadorCalculado | null,
): MarcadorConfrontacion | null {
  if (
    calculado?.partidos_pendientes !== 0 ||
    calculado.partidos_ganados === null ||
    calculado.partidos_perdidos === null
  ) {
    return null;
  }
  return { nuestros: calculado.partidos_ganados, rival: calculado.partidos_perdidos };
}

function mapearMarcadorLiga(
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
