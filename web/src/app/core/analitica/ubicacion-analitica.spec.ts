import { dominiosDeCookies, ubicacionSinDatos } from './ubicacion-analitica';

describe('ubicacionSinDatos', () => {
  it('quita el código de acceso y lo que va detrás de la página', () => {
    expect(ubicacionSinDatos('https://ctp.example.dev/gestion?code=secreto#arriba')).toBe(
      'https://ctp.example.dev/gestion',
    );
  });

  it('deja la página tal cual', () => {
    expect(ubicacionSinDatos('https://ctp.example.dev/convocatoria/abc')).toBe(
      'https://ctp.example.dev/convocatoria/abc',
    );
    expect(ubicacionSinDatos('https://ctp.example.dev/')).toBe('https://ctp.example.dev/');
  });
});

describe('dominiosDeCookies', () => {
  it('el del sitio y los de encima, sin el último', () => {
    expect(dominiosDeCookies('ctp-valdelasfuentes.padel-ctp.workers.dev')).toEqual([
      'ctp-valdelasfuentes.padel-ctp.workers.dev',
      'padel-ctp.workers.dev',
      'workers.dev',
    ]);
  });

  it('en local, solo el del sitio', () => {
    expect(dominiosDeCookies('localhost')).toEqual([]);
    expect(dominiosDeCookies('ctp.test')).toEqual(['ctp.test']);
  });
});
