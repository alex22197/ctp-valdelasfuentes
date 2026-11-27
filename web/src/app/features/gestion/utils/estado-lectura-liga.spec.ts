import type { EjecucionScraper } from '@data-access/scraper/interfaces/ejecucion-scraper.interface';
import { estadoLecturaLiga } from './estado-lectura-liga';

const AHORA = new Date('2026-11-27T12:00:00Z');

function ejecucion(fecha: string, cambios: Partial<EjecucionScraper> = {}): EjecucionScraper {
  return { fecha, ok: true, errores: [], avisos: [], ...cambios };
}

describe('estadoLecturaLiga', () => {
  it('sin ninguna lectura lo dice', () => {
    expect(estadoLecturaLiga(null, AHORA)).toEqual({ tipo: 'nunca' });
  });

  it('una lectura reciente sin incidencias está al día', () => {
    expect(estadoLecturaLiga(ejecucion('2026-11-25T14:03:00Z'), AHORA)).toEqual({
      tipo: 'al-dia',
      fecha: '2026-11-25T14:03:00Z',
    });
  });

  it('una lectura fallida enseña sus errores', () => {
    const fallida = ejecucion('2026-11-25T14:03:00Z', { ok: false, errores: ['Clausura: falló'] });
    expect(estadoLecturaLiga(fallida, AHORA)).toEqual({
      tipo: 'error',
      fecha: '2026-11-25T14:03:00Z',
      errores: ['Clausura: falló'],
    });
  });

  it('una lectura buena con avisos los enseña', () => {
    const conAvisos = ejecucion('2026-11-25T14:03:00Z', { avisos: ['El marcador no coincide'] });
    expect(estadoLecturaLiga(conAvisos, AHORA)).toMatchObject({
      tipo: 'avisos',
      avisos: ['El marcador no coincide'],
    });
  });

  it('8 días después todavía vale: el miércoles siguiente puede ir con retraso', () => {
    expect(estadoLecturaLiga(ejecucion('2026-11-19T11:00:00Z'), AHORA).tipo).toBe('al-dia');
  });

  it('con más de 8 días avisa aunque la última fuera bien', () => {
    expect(estadoLecturaLiga(ejecucion('2026-11-17T11:09:00Z'), AHORA)).toEqual({
      tipo: 'sin-leer',
      ultima: '2026-11-17T11:09:00Z',
      dias: 10,
    });
  });

  it('lo antiguo pesa más que el error: lo urgente es que no se está leyendo', () => {
    const vieja = ejecucion('2026-11-10T14:00:00Z', { ok: false, errores: ['falló'] });
    expect(estadoLecturaLiga(vieja, AHORA).tipo).toBe('sin-leer');
  });
});
