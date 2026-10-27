import {
  type FilaPartidoJugadorEquipo,
  mapearPartidosJugadores,
} from './partidos-jugadores.mapper';

const fila: FilaPartidoJugadorEquipo = {
  jugador_id: 'a',
  nombre_mostrar: 'Pablo',
  comodin: false,
  confrontacion_id: 'c',
  tipo: 'masculino',
  numero: 1,
  lado: 'reves',
  ganado: false,
  es_wo: false,
  marcador: '2-6 4-6',
  companero_nombre: 'Iván',
};

describe('mapearPartidosJugadores', () => {
  it('pasa cada fila a un partido con su jugador', () => {
    expect(mapearPartidosJugadores([fila])).toEqual([
      {
        jugador: { id: 'a', nombreMostrar: 'Pablo', comodin: false },
        confrontacionId: 'c',
        tipo: 'masculino',
        numero: 1,
        lado: 'reves',
        ganado: false,
        esWo: false,
        marcador: '2-6 4-6',
        companero: 'Iván',
      },
    ]);
  });

  it('descarta las filas sin jugador o sin ganador', () => {
    expect(mapearPartidosJugadores([{ ...fila, jugador_id: null }])).toEqual([]);
    expect(mapearPartidosJugadores([{ ...fila, ganado: null }])).toEqual([]);
  });
});
