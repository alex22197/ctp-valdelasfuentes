import {
  mapearBalancesLado,
  mapearBalancesPuesto,
  mapearCompaneros,
  mapearPartidosDeJugador,
  mapearResumenJugador,
} from './estadisticas-jugador.mapper';

const BALANCE = { partidos: 3, ganados: 2, perdidos: 1, porcentaje_victorias: 67 };

describe('mapearResumenJugador', () => {
  it('pasa los totales a camelCase y los nulos a 0', () => {
    expect(
      mapearResumenJugador({
        ...BALANCE,
        sets_ganados: 4,
        sets_perdidos: 2,
        juegos_ganados: 31,
        juegos_perdidos: null,
        jornadas: 3,
        wo_a_favor: 0,
      }),
    ).toEqual({
      partidos: 3,
      ganados: 2,
      perdidos: 1,
      porcentajeVictorias: 67,
      setsGanados: 4,
      setsPerdidos: 2,
      juegosGanados: 31,
      juegosPerdidos: 0,
      jornadas: 3,
      woAFavor: 0,
    });
  });

  it('deja el porcentaje en null si no hay partidos', () => {
    const resumen = mapearResumenJugador({
      partidos: 0,
      ganados: 0,
      perdidos: 0,
      porcentaje_victorias: null,
      sets_ganados: 0,
      sets_perdidos: 0,
      juegos_ganados: 0,
      juegos_perdidos: 0,
      jornadas: 0,
      wo_a_favor: 1,
    });
    expect(resumen.porcentajeVictorias).toBeNull();
    expect(resumen.woAFavor).toBe(1);
  });
});

describe('mapearBalancesLado y mapearBalancesPuesto', () => {
  it('descartan las filas sin lado o sin puesto', () => {
    expect(
      mapearBalancesLado([
        { ...BALANCE, lado: 'reves' },
        { ...BALANCE, lado: null },
      ]),
    ).toEqual([{ partidos: 3, ganados: 2, perdidos: 1, porcentajeVictorias: 67, lado: 'reves' }]);
    expect(
      mapearBalancesPuesto([
        { ...BALANCE, tipo: 'masculino', numero: 1 },
        { ...BALANCE, tipo: 'mixto', numero: null },
      ]),
    ).toEqual([
      {
        partidos: 3,
        ganados: 2,
        perdidos: 1,
        porcentajeVictorias: 67,
        tipo: 'masculino',
        numero: 1,
      },
    ]);
  });
});

describe('mapearCompaneros', () => {
  const pareja = {
    ...BALANCE,
    jugador_a_id: 'a',
    jugador_a_nombre: 'Jorge',
    jugador_a_comodin: false,
    jugador_b_id: 'b',
    jugador_b_nombre: 'Sergio',
    jugador_b_comodin: true,
  };

  it('devuelve al otro jugador de la pareja, esté en a o en b', () => {
    expect(mapearCompaneros([pareja], 'a')[0]).toMatchObject({
      id: 'b',
      nombreMostrar: 'Sergio',
      comodin: true,
    });
    expect(mapearCompaneros([pareja], 'b')[0]).toMatchObject({
      id: 'a',
      nombreMostrar: 'Jorge',
      comodin: false,
    });
  });

  it('descarta parejas sin compañero', () => {
    expect(mapearCompaneros([{ ...pareja, jugador_b_id: null }], 'a')).toEqual([]);
  });
});

describe('mapearPartidosDeJugador', () => {
  const fila = {
    confrontacion_id: 'c1',
    tipo: 'masculino' as const,
    numero: 2,
    lado: 'reves' as const,
    ganado: true,
    es_wo: false,
    marcador: '6-3 6-4',
    companero_id: 'p',
    companero_nombre: 'Pablo',
  };

  it('arma el partido con su compañero', () => {
    expect(mapearPartidosDeJugador([fila])).toEqual([
      {
        confrontacionId: 'c1',
        tipo: 'masculino',
        numero: 2,
        lado: 'reves',
        ganado: true,
        esWo: false,
        marcador: '6-3 6-4',
        companero: { id: 'p', nombreMostrar: 'Pablo' },
      },
    ]);
  });

  it('deja el compañero en null si falta y descarta partidos sin ganador', () => {
    expect(mapearPartidosDeJugador([{ ...fila, companero_id: null }])[0]?.companero).toBeNull();
    expect(mapearPartidosDeJugador([{ ...fila, ganado: null }])).toEqual([]);
  });
});
