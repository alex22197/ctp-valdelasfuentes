import {
  mapearParejas,
  mapearParticipacion,
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

describe('mapearParticipacion', () => {
  it('pasa los contadores a camelCase y los nulos a 0', () => {
    expect(
      mapearParticipacion([
        {
          jugador_id: 'd',
          nombre_mostrar: 'Diego',
          confrontaciones: 2,
          jugadas: 0,
          disponible_sin_jugar: null,
          no_disponible: 1,
          sin_responder: 1,
          porcentaje_jugadas: 0,
        },
      ]),
    ).toEqual([
      {
        id: 'd',
        nombreMostrar: 'Diego',
        confrontaciones: 2,
        jugadas: 0,
        disponibleSinJugar: 0,
        noDisponible: 1,
        sinResponder: 1,
        porcentajeJugadas: 0,
      },
    ]);
  });
});

describe('mapearPartidosDeJornada', () => {
  it('conserva el resultado y el ganado nulos de un partido por jugar', () => {
    expect(
      mapearPartidosDeJornada([
        { confrontacion_id: 'c', tipo: 'mixto', numero: 1, resultado: null, ganado: null },
        { confrontacion_id: null, tipo: 'mixto', numero: 1, resultado: null, ganado: null },
      ]),
    ).toEqual([{ confrontacionId: 'c', tipo: 'mixto', numero: 1, resultado: null, ganado: null }]);
  });
});
