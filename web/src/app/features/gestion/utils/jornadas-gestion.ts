import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from '@data-access/confrontaciones/interfaces/estado-confrontacion.type';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import type { JornadasGestion } from '../interfaces/jornadas-gestion.interface';

const ESTADOS_POR_JUGAR: readonly EstadoConfrontacion[] = ['programada', 'aplazada', 'suspendida'];

/**
 * Reparte el calendario en lo que tiene que hacer un gestor: la próxima jornada (para su
 * convocatoria) y las ya jugadas a las que les faltan resultados. `hoy` es AAAA-MM-DD en
 * Madrid. La jornada de hoy sale en las dos cosas, porque se convoca y se juega el mismo día.
 * Sin fecha conocida, una jornada solo puede ser la próxima.
 */
export function organizarJornadasGestion(
  calendario: readonly ConfrontacionNuestroEquipo[],
  hoy: string,
): JornadasGestion {
  const porJugar = calendario.filter((jornada) => ESTADOS_POR_JUGAR.includes(jornada.estado));
  return {
    proxima:
      porJugar.find((jornada) => {
        const dia = diaDeJuego(jornada);
        return dia === null || dia >= hoy;
      }) ?? null,
    sinResultados: porJugar.filter((jornada) => {
      const dia = diaDeJuego(jornada);
      return dia !== null && dia <= hoy;
    }),
  };
}

/** El día real si ya hay hora; si no, el fin de semana del calendario oficial. */
function diaDeJuego(jornada: ConfrontacionNuestroEquipo): string | null {
  return jornada.fechaHora ? fechaIsoEnMadrid(new Date(jornada.fechaHora)) : jornada.fechaPrevista;
}
