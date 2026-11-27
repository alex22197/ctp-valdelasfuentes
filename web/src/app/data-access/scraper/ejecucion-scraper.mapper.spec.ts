import { mapearEjecucionScraper } from './ejecucion-scraper.mapper';

const FECHA = '2026-11-25T23:03:21Z';

describe('mapearEjecucionScraper', () => {
  it('una lectura sin incidencias no tiene errores ni avisos', () => {
    expect(
      mapearEjecucionScraper({
        fecha: FECHA,
        ok: true,
        mensaje: 'Clausura, 4ª División, zona 1: página de Clausura; clasificación de 4 equipos.',
      }),
    ).toEqual({ fecha: FECHA, ok: true, errores: [], avisos: [] });
  });

  it('separa el error de cada fase', () => {
    const ejecucion = mapearEjecucionScraper({
      fecha: FECHA,
      ok: false,
      mensaje:
        'Clausura, 4ª División, zona 1: ERROR, No se ha podido leer nuestros marcadores: ' +
        'permission denied for view confrontacion_marcador',
    });
    expect(ejecucion.errores).toEqual([
      'Clausura, 4ª División, zona 1: No se ha podido leer nuestros marcadores: ' +
        'permission denied for view confrontacion_marcador',
    ]);
    expect(ejecucion.avisos).toEqual([]);
  });

  it('recoge los avisos aunque la lectura fuera bien', () => {
    const ejecucion = mapearEjecucionScraper({
      fecha: FECHA,
      ok: true,
      mensaje:
        'Retos: 1 cruces nuestros.\n' +
        '  AVISO: Retos CTPA-SSR: el marcador no coincide, la liga dice 4-2 y la web 3-3\n' +
        '  AVISO: Retos CTPA-SSR: la liga ya tiene resultado y nos faltan 2 partidos',
    });
    expect(ejecucion.avisos).toEqual([
      'Retos CTPA-SSR: el marcador no coincide, la liga dice 4-2 y la web 3-3',
      'Retos CTPA-SSR: la liga ya tiene resultado y nos faltan 2 partidos',
    ]);
  });

  it('avisa cuando no hay ninguna fase que leer', () => {
    const ejecucion = mapearEjecucionScraper({
      fecha: FECHA,
      ok: true,
      mensaje: 'Ninguna fase en juego con página en la liga: nada que leer.',
    });
    expect(ejecucion.avisos).toHaveLength(1);
    expect(ejecucion.avisos[0]).toContain('darla de alta');
  });

  it('si falló con un mensaje inesperado, el mensaje entero es el error', () => {
    expect(
      mapearEjecucionScraper({ fecha: FECHA, ok: false, mensaje: 'Algo raro' }).errores,
    ).toEqual(['Algo raro']);
    expect(mapearEjecucionScraper({ fecha: FECHA, ok: false, mensaje: null }).errores).toEqual([
      'Falló sin dejar detalle.',
    ]);
  });
});
