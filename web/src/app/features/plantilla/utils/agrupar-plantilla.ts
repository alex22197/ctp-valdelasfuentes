import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import type { JugadorPlantilla } from '@data-access/jugadores/interfaces/jugador-plantilla.interface';
import { iniciales } from '@shared/utils/iniciales';
import type { FilaPlantilla } from '../interfaces/fila-plantilla.interface';
import type { GruposPlantilla } from '../interfaces/grupos-plantilla.interface';

/**
 * Separa la plantilla en chicos, chicas y comodines, por orden alfabético, y añade a cada
 * uno sus partidos y su porcentaje de victorias (cero partidos si aún no ha jugado).
 */
export function agruparPlantilla(
  jugadores: readonly JugadorPlantilla[],
  resumenes: ReadonlyMap<string, ResumenJugador>,
): GruposPlantilla {
  const filas = [...jugadores]
    .sort((a, b) => a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'))
    .map((jugador) => ({ jugador, fila: filaPlantilla(jugador, resumenes.get(jugador.id)) }));
  const de = (incluir: (jugador: JugadorPlantilla) => boolean): FilaPlantilla[] =>
    filas.filter(({ jugador }) => incluir(jugador)).map(({ fila }) => fila);

  return {
    chicos: de((j) => !j.comodin && j.sexo === 'masculino'),
    chicas: de((j) => !j.comodin && j.sexo === 'femenino'),
    comodines: de((j) => j.comodin),
  };
}

function filaPlantilla(jugador: JugadorPlantilla, resumen?: ResumenJugador): FilaPlantilla {
  return {
    id: jugador.id,
    nombreMostrar: jugador.nombreMostrar,
    iniciales: iniciales(jugador.nombreMostrar),
    partidos: resumen?.partidos ?? 0,
    porcentajeVictorias: resumen?.porcentajeVictorias ?? null,
  };
}
