import type { FaseALeer } from './interfaces/fase-a-leer.interface.ts';

/** Días que se sigue leyendo una fase acabada: la liga corrige resultados con retraso. */
const DIAS_DE_MARGEN = 7;

/**
 * Se lee una fase si ya ha empezado (o no se sabe cuándo empieza) y no lleva más de una
 * semana acabada. Así cada miércoles se hace una petición por fase en juego, y ninguna por la
 * apertura cuando ya estamos en el clausura. `hoy` es AAAA-MM-DD.
 */
export function faseActiva(fase: FaseALeer, hoy: string): boolean {
  if (fase.inicio !== null && fase.inicio > hoy) {
    return false;
  }
  if (fase.fin === null) {
    return true;
  }
  const limite = new Date(`${fase.fin}T00:00:00Z`);
  limite.setUTCDate(limite.getUTCDate() + DIAS_DE_MARGEN);
  return limite.toISOString().slice(0, 10) >= hoy;
}

/** Hoy en Madrid, en AAAA-MM-DD. */
export function hoyEnMadrid(ahora: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(ahora);
}
