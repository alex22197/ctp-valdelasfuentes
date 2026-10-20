import {
  mapearParejas,
  mapearPartidosDeJornada,
  mapearPuestosEquipo,
} from './estadisticas-equipo.mapper';

const BALANCE = { partidos: 2, ganados: 1, perdidos: 1, porcentaje_victorias: 50 };

describe('mapearPuestosEquipo', () => {
  it('añade los WO y descarta filas sin puesto', () => {
    expect(
      mapearPuestosEquipo([
        { ...BALANCE, tipo: 'femenino', numero: 1, wo_a_favor: 1, wo_en_contra: null },
        { ...BALANCE, tipo: null, numero: 1, wo_a_favor: 0, wo_en_contra: 0 },
      ]),
    ).toEqual([
      {
        partidos: 2,
        ganados: 1,
        perdidos: 1,
        porcentajeVictorias: 50,
        tipo: 'femenino',
        numero: 1,
        woAFavor: 1,
        woEnContra: 0,
      },
    ]);
  });
});

describe('mapearParejas', () => {
  const fila = {
    ...BALANCE,
    tipo: 'mixto' as const,
    jugador_a_id: 'r',
    jugador_a_nombre: 'Rocio',
    jugador_a_comodin: false,
    jugador_b_id: 'i',
    jugador_b_nombre: 'Ivan G',
    jugador_b_comodin: null,
  };

  it('arma los dos jugadores de la pareja', () => {
    expect(mapearParejas([fila])[0]).toMatchObject({
      tipo: 'mixto',
      jugadorA: { id: 'r', nombreMostrar: 'Rocio', comodin: false },
      jugadorB: { id: 'i', nombreMostrar: 'Ivan G', comodin: false },
    });
  });

  it('descarta parejas incompletas', () => {
    expect(mapearParejas([{ ...fila, jugador_b_id: null }])).toEqual([]);
  });
});

describe('mapearPartidosDeJornada', () => {
  const vacio = { set_partido: [], participacion: [] };

  it('conserva el resultado y el ganado nulos de un partido por jugar', () => {
    expect(
      mapearPartidosDeJornada([
        {
          ...vacio,
          confrontacion_id: 'c',
          tipo: 'mixto',
          numero: 1,
          resultado: null,
          ganado: null,
        },
        {
          ...vacio,
          confrontacion_id: null,
          tipo: 'mixto',
          numero: 1,
          resultado: null,
          ganado: null,
        },
      ]),
    ).toEqual([
      {
        confrontacionId: 'c',
        tipo: 'mixto',
        numero: 1,
        resultado: null,
        ganado: null,
        reves: null,
        drive: null,
        sets: [],
      },
    ]);
  });

  it('añade la pareja y los sets en orden', () => {
    const set = (numero: number, nuestros: number, rival: number) => ({
      numero,
      juegos_nuestros: nuestros,
      juegos_rival: rival,
      tiebreak_nuestros: null,
      tiebreak_rival: null,
    });
    const [partido] = mapearPartidosDeJornada([
      {
        confrontacion_id: 'c',
        tipo: 'masculino',
        numero: 2,
        resultado: 'normal',
        ganado: true,
        set_partido: [set(2, 6, 4), set(1, 6, 3)],
        participacion: [
          { lado: 'drive', jugador: { id: 'b', nombre_mostrar: 'Iván' } },
          { lado: 'reves', jugador: { id: 'a', nombre_mostrar: 'Pablo' } },
        ],
      },
    ]);
    expect(partido?.reves?.nombreMostrar).toBe('Pablo');
    expect(partido?.drive?.nombreMostrar).toBe('Iván');
    expect(partido?.sets.map((s) => `${s.juegosNuestros}-${s.juegosRival}`)).toEqual([
      '6-3',
      '6-4',
    ]);
  });
});
