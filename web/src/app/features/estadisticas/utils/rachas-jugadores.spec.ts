import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoJugadorEquipo } from '@data-access/estadisticas/interfaces/partido-jugador-equipo.interface';
import { rachasPorJugador } from './rachas-jugadores';

const jornada = (confrontacionId: string, numero: number): JornadaJugada => ({
  confrontacionId,
  faseId: 'f',
  faseNombre: 'Apertura',
  faseOrden: 1,
  jornada: numero,
  rival: 'Rival',
  condicion: 'local',
  partidosGanados: 3,
  partidosPerdidos: 3,
  puntos: 1,
});

const partido = (
  id: string,
  confrontacionId: string,
  ganado: boolean,
  esWo = false,
): PartidoJugadorEquipo => ({
  jugador: { id, nombreMostrar: id, comodin: false },
  confrontacionId,
  tipo: 'masculino',
  numero: 1,
  lado: 'drive',
  ganado,
  esWo,
  marcador: null,
  companero: null,
});

describe('rachasPorJugador', () => {
  const jornadas = [jornada('j1', 1), jornada('j2', 2), jornada('j3', 3)];

  it('ordena por jornada aunque los partidos lleguen desordenados', () => {
    const rachas = rachasPorJugador(jornadas, [
      partido('a', 'j3', true),
      partido('a', 'j1', false),
      partido('a', 'j2', true),
    ]);
    expect(rachas.get('a')).toEqual({ tipo: 'victorias', largo: 2 });
  });

  it('no cuenta los WO ni las jornadas de otra fase', () => {
    const rachas = rachasPorJugador(jornadas, [
      partido('a', 'j1', false),
      partido('a', 'j2', true, true),
      partido('a', 'otra', true),
    ]);
    expect(rachas.get('a')).toEqual({ tipo: 'derrotas', largo: 1 });
    expect(rachasPorJugador(jornadas, [partido('b', 'j1', true, true)]).has('b')).toBe(false);
  });
});
