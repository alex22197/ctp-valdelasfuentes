import type { Tables } from '@core/supabase/interfaces/database.types';
import type { EjecucionScraper } from './interfaces/ejecucion-scraper.interface';

export type FilaEjecucionScraper = Pick<Tables<'ejecucion_scraper'>, 'fecha' | 'ok' | 'mensaje'>;

/** Así escribe el scraper (`scraper/src/index.ts`) cada parte de su mensaje. */
const ERROR = /^(.+?): ERROR, (.+)$/;
const AVISO = /^AVISO: (.+)$/;
const NINGUNA_FASE = 'Ninguna fase en juego';

/**
 * Una ejecución del scraper con su mensaje separado en errores y avisos, para enseñarlos en
 * Gestión. Si falló y el mensaje no tiene la forma esperada, el mensaje entero es el error.
 */
export function mapearEjecucionScraper(fila: FilaEjecucionScraper): EjecucionScraper {
  const lineas = (fila.mensaje ?? '')
    .replace(/^\[simulación\] /, '')
    .split('\n')
    .map((linea) => linea.trim())
    .filter((linea) => linea.length > 0);
  const errores: string[] = [];
  const avisos: string[] = [];
  for (const linea of lineas) {
    const error = ERROR.exec(linea);
    const aviso = AVISO.exec(linea);
    if (error) {
      errores.push(`${error[1]}: ${error[2]}`);
    } else if (aviso?.[1]) {
      avisos.push(aviso[1]);
    } else if (linea.startsWith(NINGUNA_FASE)) {
      avisos.push(
        'No hay ninguna fase en juego con su página de la liga. Si ha empezado una fase nueva, ' +
          'hay que darla de alta para que se lea.',
      );
    }
  }
  if (!fila.ok && errores.length === 0) {
    errores.push(fila.mensaje?.trim() || 'Falló sin dejar detalle.');
  }
  return { fecha: fila.fecha, ok: fila.ok, errores, avisos };
}
