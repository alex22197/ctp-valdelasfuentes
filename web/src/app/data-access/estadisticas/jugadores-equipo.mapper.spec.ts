import { mapearEstadisticasJugadores, mapearLadosJugadores } from './jugadores-equipo.mapper';

describe('mapearEstadisticasJugadores', () => {
  it('añade id, nombre y comodín al resumen', () => {
    const [jugador] = mapearEstadisticasJugadores([
      {
        jugador_id: 's',
        nombre_mostrar: 'Sergio',
        comodin: null,
        partidos: 3,
        ganados: 2,
        perdidos: 1,
        porcentaje_victorias: 67,
        sets_ganados: 4,
        sets_perdidos: 2,
        juegos_ganados: 31,
        juegos_perdidos: 22,
        jornadas: 3,
        wo_a_favor: 0,
      },
    ]);
    expect(jugador).toMatchObject({
      id: 's',
      nombreMostrar: 'Sergio',
      comodin: false,
      partidos: 3,
    });
  });
});

describe('mapearLadosJugadores', () => {
  const fila = {
    jugador_id: 's',
    nombre_mostrar: 'Sergio',
    comodin: false,
    partidos: 2,
    ganados: 1,
    perdidos: 1,
    porcentaje_victorias: 50,
  };

  it('junta revés y drive de cada jugador y deja a cero el lado que no ha jugado', () => {
    const lados = mapearLadosJugadores([
      { ...fila, lado: 'reves' },
      { ...fila, jugador_id: 'j', nombre_mostrar: 'Jorge', lado: 'drive', partidos: 1 },
      { ...fila, lado: 'drive', partidos: 1, ganados: 1, perdidos: 0, porcentaje_victorias: 100 },
    ]);
    expect(lados.map((l) => [l.nombreMostrar, l.reves.partidos, l.drive.partidos])).toEqual([
      ['Sergio', 2, 1],
      ['Jorge', 0, 1],
    ]);
    expect(lados[1]?.reves.porcentajeVictorias).toBeNull();
  });
});
