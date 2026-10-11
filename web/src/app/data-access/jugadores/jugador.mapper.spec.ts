import { mapearJugadorPlantilla } from './jugador.mapper';

describe('mapearJugadorPlantilla', () => {
  it('junta los datos del jugador con su marca de comodín', () => {
    expect(
      mapearJugadorPlantilla({
        comodin: true,
        jugador: { id: 'j1', nombre_mostrar: 'Jess', sexo: 'femenino', lado_preferido: 'drive' },
      }),
    ).toEqual({
      id: 'j1',
      nombreMostrar: 'Jess',
      sexo: 'femenino',
      ladoPreferido: 'drive',
      comodin: true,
    });
  });
});
