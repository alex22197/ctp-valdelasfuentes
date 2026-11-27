import type { EjecucionScraper } from '@data-access/scraper/interfaces/ejecucion-scraper.interface';
import type { EstadoLecturaLiga } from '../interfaces/estado-lectura-liga.type';

/** El scraper se lanza cada miércoles: con un día de margen, más de 8 es que no ha leído. */
export const DIAS_SIN_LEER = 8;

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * Qué contar de la última lectura de la liga: si es demasiado antigua, eso primero, aunque
 * fuera bien; después, si falló o dejó avisos.
 */
export function estadoLecturaLiga(ultima: EjecucionScraper | null, ahora: Date): EstadoLecturaLiga {
  if (!ultima) {
    return { tipo: 'nunca' };
  }
  const dias = Math.floor((ahora.getTime() - new Date(ultima.fecha).getTime()) / MS_POR_DIA);
  if (dias > DIAS_SIN_LEER) {
    return { tipo: 'sin-leer', ultima: ultima.fecha, dias };
  }
  if (!ultima.ok) {
    return { tipo: 'error', fecha: ultima.fecha, errores: ultima.errores };
  }
  if (ultima.avisos.length > 0) {
    return { tipo: 'avisos', fecha: ultima.fecha, avisos: ultima.avisos };
  }
  return { tipo: 'al-dia', fecha: ultima.fecha };
}
