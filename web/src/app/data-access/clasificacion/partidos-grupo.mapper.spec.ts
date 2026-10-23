import { mapearPartidosGrupo } from './partidos-grupo.mapper';

describe('mapearPartidosGrupo', () => {
  it('pasa la fila a su equipo con los partidos a favor y en contra', () => {
    expect(
      mapearPartidosGrupo({
        fase_id: 'f',
        partidos_favor: 8,
        partidos_contra: null,
        equipo: { id: 'e', nombre: 'Soto Torrejón', es_nuestro: false },
      }),
    ).toEqual({
      faseId: 'f',
      equipo: { id: 'e', nombre: 'Soto Torrejón', esNuestro: false },
      partidosFavor: 8,
      partidosContra: null,
    });
  });
});
