import { mapearFormato } from './competicion.mapper';

describe('mapearFormato', () => {
  it('lee el número de partidos de cada tipo', () => {
    expect(mapearFormato({ masculino: 3, femenino: 2, mixto: 1 })).toEqual({
      masculino: 3,
      femenino: 2,
      mixto: 1,
    });
  });

  it('toma como 0 los valores que no son un número de partidos', () => {
    expect(mapearFormato({ masculino: 3, femenino: '2', mixto: -1 })).toEqual({
      masculino: 3,
      femenino: 0,
      mixto: 0,
    });
    expect(mapearFormato(null)).toEqual({ masculino: 0, femenino: 0, mixto: 0 });
  });
});
