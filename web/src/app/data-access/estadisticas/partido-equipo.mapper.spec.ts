import { type FilaPartidoEquipo, mapearPartidosEquipo } from './partido-equipo.mapper';

const fila: FilaPartidoEquipo = {
  confrontacion_id: 'c',
  fase_id: 'f',
  jornada: 2,
  condicion: 'visitante',
  tipo: 'femenino',
  numero: 1,
  ganado: true,
  es_wo: false,
  sets_jugados: 3,
  sets_ganados: 2,
  sets_perdidos: 1,
  tiebreaks_jugados: 1,
  tiebreaks_ganados: 1,
};

describe('mapearPartidosEquipo', () => {
  it('pasa cada columna a su campo', () => {
    expect(mapearPartidosEquipo([fila])).toEqual([
      {
        confrontacionId: 'c',
        faseId: 'f',
        jornada: 2,
        condicion: 'visitante',
        tipo: 'femenino',
        numero: 1,
        ganado: true,
        esWo: false,
        setsJugados: 3,
        setsGanados: 2,
        setsPerdidos: 1,
        tiebreaksJugados: 1,
        tiebreaksGanados: 1,
      },
    ]);
  });

  it('un WO va sin sets y con esWo', () => {
    const wo = mapearPartidosEquipo([
      { ...fila, es_wo: true, sets_jugados: null, sets_ganados: null, tiebreaks_jugados: null },
    ]);
    expect(wo[0]).toMatchObject({
      esWo: true,
      setsJugados: 0,
      setsGanados: 0,
      tiebreaksJugados: 0,
    });
  });

  it('descarta las filas sin ganador o con una condición rara', () => {
    expect(mapearPartidosEquipo([{ ...fila, ganado: null }])).toEqual([]);
    expect(mapearPartidosEquipo([{ ...fila, condicion: 'otra' }])).toEqual([]);
  });
});
