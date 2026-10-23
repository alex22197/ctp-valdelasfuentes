import { mapearEquipoResumen } from '@data-access/equipos/equipo.mapper';
import {
  type FilaConfrontacion,
  type FilaMarcadorCalculado,
  mapearConfrontacionNuestroEquipo,
} from './confrontacion.mapper';
import type { EnfrentamientoGrupo } from './interfaces/enfrentamiento-grupo.interface';
import type { MarcadorEnfrentamiento } from './interfaces/marcador-enfrentamiento.interface';

/**
 * Un enfrentamiento del grupo con el marcador de local a visitante. El nuestro sale de
 * nuestros resultados, como en el resto de la web; el de los demás, del que se apunta de la
 * web de la liga.
 */
export function mapearEnfrentamientoGrupo(
  fila: FilaConfrontacion,
  marcadorCalculado: FilaMarcadorCalculado | null = null,
): EnfrentamientoGrupo {
  return {
    id: fila.id,
    jornada: fila.jornada,
    local: mapearEquipoResumen(fila.local),
    visitante: mapearEquipoResumen(fila.visitante),
    estado: fila.estado,
    marcador: marcadorDe(fila, marcadorCalculado),
  };
}

function marcadorDe(
  fila: FilaConfrontacion,
  marcadorCalculado: FilaMarcadorCalculado | null,
): MarcadorEnfrentamiento | null {
  const nuestra = mapearConfrontacionNuestroEquipo(fila, marcadorCalculado);
  if (nuestra) {
    const marcador = nuestra.marcador;
    if (!marcador) {
      return null;
    }
    return nuestra.condicion === 'local'
      ? { local: marcador.nuestros, visitante: marcador.rival }
      : { local: marcador.rival, visitante: marcador.nuestros };
  }
  if (fila.partidos_local === null || fila.partidos_visitante === null) {
    return null;
  }
  return { local: fila.partidos_local, visitante: fila.partidos_visitante };
}
