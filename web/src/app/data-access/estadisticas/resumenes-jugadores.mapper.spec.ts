import { mapearResumenesPorJugador } from './resumenes-jugadores.mapper';

const fila = {
  partidos: 2,
  ganados: 1,
  perdidos: 1,
  porcentaje_victorias: 50,
  sets_ganados: 2,
  sets_perdidos: 2,
  juegos_ganados: 19,
  juegos_perdidos: 14,
  jornadas: 2,
  wo_a_favor: 0,
};

describe('mapearResumenesPorJugador', () => {
  it('indexa cada resumen por el id del jugador', () => {
    const resumenes = mapearResumenesPorJugador([{ ...fila, jugador_id: 'sergio' }]);
    expect(resumenes.get('sergio')?.porcentajeVictorias).toBe(50);
    expect(resumenes.size).toBe(1);
  });

  it('descarta filas sin jugador', () => {
    expect(mapearResumenesPorJugador([{ ...fila, jugador_id: null }]).size).toBe(0);
  });
});
