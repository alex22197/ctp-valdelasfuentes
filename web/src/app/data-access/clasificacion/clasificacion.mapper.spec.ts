import { mapearFilaClasificacion } from './clasificacion.mapper';

describe('mapearFilaClasificacion', () => {
  it('pasa cada columna a su campo, con el equipo', () => {
    expect(
      mapearFilaClasificacion({
        posicion: 2,
        puntos: 4,
        ganados: 2,
        empatados: 0,
        perdidos: 1,
        partidos_favor: 8,
        partidos_contra: 4,
        actualizado_en: '2026-10-21T16:00:00Z',
        equipo: { id: 'ctpa', nombre: 'CTPA Valdelasfuentes', es_nuestro: true },
      }),
    ).toEqual({
      posicion: 2,
      equipo: { id: 'ctpa', nombre: 'CTPA Valdelasfuentes', esNuestro: true },
      puntos: 4,
      ganados: 2,
      empatados: 0,
      perdidos: 1,
      partidosFavor: 8,
      partidosContra: 4,
      actualizadaEn: '2026-10-21T16:00:00Z',
    });
  });
});
