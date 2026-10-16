import { mapearEquipoResumen } from './equipo.mapper';

describe('mapearEquipoResumen', () => {
  it('pasa el equipo a camelCase', () => {
    expect(mapearEquipoResumen({ id: 'e1', nombre: 'Padelgon "C"', es_nuestro: false })).toEqual({
      id: 'e1',
      nombre: 'Padelgon "C"',
      esNuestro: false,
    });
  });
});
