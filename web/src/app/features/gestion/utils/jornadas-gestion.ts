import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import {
  ESTADOS_POR_JUGAR,
  diaDeJuego,
  elegirProximaConfrontacion,
} from '@data-access/confrontaciones/proxima-confrontacion';
import type { JornadasGestion } from '../interfaces/jornadas-gestion.interface';

/**
 * Reparte el calendario en lo que tiene que hacer un gestor: la próxima jornada (para su
 * convocatoria, la misma que enseña la portada) y las ya jugadas a las que les faltan
 * resultados. `hoy` es AAAA-MM-DD en Madrid. La jornada de hoy sale en las dos cosas, porque se
 * convoca y se juega el mismo día. Una aplazada no pide resultados hasta que tenga fecha nueva.
 */
export function organizarJornadasGestion(
  calendario: readonly ConfrontacionNuestroEquipo[],
  hoy: string,
): JornadasGestion {
  return {
    proxima: elegirProximaConfrontacion(calendario, hoy),
    sinResultados: calendario.filter((jornada) => {
      const dia = diaDeJuego(jornada, hoy);
      return ESTADOS_POR_JUGAR.includes(jornada.estado) && dia !== null && dia <= hoy;
    }),
  };
}
