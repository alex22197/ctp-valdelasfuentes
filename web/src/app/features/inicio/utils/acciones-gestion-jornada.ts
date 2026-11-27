import { estaPorJugar } from '@data-access/confrontaciones/estado-jornada';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { diaDeJuego } from '@data-access/confrontaciones/proxima-confrontacion';
import type { AccionGestionJornada } from '../interfaces/accion-gestion-jornada.interface';

/**
 * Lo que un gestor puede querer hacer con una jornada según el momento, y nada más: antes de
 * jugarla, su convocatoria; cuando ya pasó, meter los resultados; terminada, corregirlos. El
 * día del partido se ofrecen las dos primeras. `hoy` es AAAA-MM-DD en Madrid.
 */
export function accionesGestionJornada(
  jornada: ConfrontacionNuestroEquipo,
  hoy: string,
): AccionGestionJornada[] {
  const resultados = ['/resultados', jornada.id];
  if (!estaPorJugar(jornada.estado)) {
    return [{ texto: 'Editar resultados', ruta: resultados }];
  }
  const dia = diaDeJuego(jornada);
  const acciones: AccionGestionJornada[] = [];
  if (dia === null || dia >= hoy) {
    acciones.push({ texto: 'Convocatoria', ruta: ['/convocatoria', jornada.id] });
  }
  if (dia !== null && dia <= hoy) {
    acciones.push({ texto: 'Meter resultados', ruta: resultados });
  }
  return acciones;
}
