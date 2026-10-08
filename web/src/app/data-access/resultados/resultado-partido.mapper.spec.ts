import {
  mapearParametrosGuardarResultado,
  mapearPartidoConResultado,
} from './resultado-partido.mapper';

describe('mapearPartidoConResultado', () => {
  it('ordena los sets y coloca a la pareja en su lado', () => {
    const partido = mapearPartidoConResultado({
      tipo: 'masculino',
      numero: 1,
      resultado: 'normal',
      ganado: null,
      set_partido: [
        { numero: 2, juegos_nuestros: 7, juegos_rival: 6, tiebreak_nuestros: 7, tiebreak_rival: 4 },
        {
          numero: 1,
          juegos_nuestros: 6,
          juegos_rival: 4,
          tiebreak_nuestros: null,
          tiebreak_rival: null,
        },
      ],
      participacion: [
        { lado: 'drive', jugador: { id: 'jorge', nombre_mostrar: 'Jorge' } },
        { lado: 'reves', jugador: { id: 'sergio', nombre_mostrar: 'Sergio' } },
      ],
    });

    expect(partido.reves?.nombreMostrar).toBe('Sergio');
    expect(partido.marcador.sets.map((set) => set.juegosNuestros)).toEqual([6, 7]);
    expect(partido.marcador.sets[1]?.tiebreakRival).toBe(4);
  });
});

describe('mapearParametrosGuardarResultado', () => {
  it('pasa los sets a snake_case', () => {
    const parametros = mapearParametrosGuardarResultado({
      resultado: 'abandono',
      ganado: false,
      sets: [{ juegosNuestros: 3, juegosRival: 2, tiebreakNuestros: null, tiebreakRival: null }],
    });
    expect(parametros).toEqual({
      p_resultado: 'abandono',
      p_ganado: false,
      p_sets: [
        { juegos_nuestros: 3, juegos_rival: 2, tiebreak_nuestros: null, tiebreak_rival: null },
      ],
    });
  });

  it('omite el resultado y el ganador cuando el partido vuelve a estar por jugar', () => {
    expect(mapearParametrosGuardarResultado({ resultado: null, ganado: null, sets: [] })).toEqual({
      p_sets: [],
    });
  });
});
