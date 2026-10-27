import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoJugadorEquipo } from '@data-access/estadisticas/interfaces/partido-jugador-equipo.interface';
import { construirMapaForma } from './mapa-forma';

const jornada = (confrontacionId: string, numero: number | null, rival: string): JornadaJugada => ({
  confrontacionId,
  faseId: 'f',
  faseNombre: 'Apertura',
  faseOrden: 1,
  jornada: numero,
  rival,
  condicion: 'visitante',
  partidosGanados: 3,
  partidosPerdidos: 3,
  puntos: 1,
});

const partido = (
  id: string,
  nombre: string,
  confrontacionId: string,
  ganado: boolean,
  extra: Partial<PartidoJugadorEquipo> = {},
): PartidoJugadorEquipo => ({
  jugador: { id, nombreMostrar: nombre, comodin: false },
  confrontacionId,
  tipo: 'masculino',
  numero: 1,
  lado: 'reves',
  ganado,
  esWo: false,
  marcador: '6-3 6-4',
  companero: 'Iván',
  ...extra,
});

const SEXOS = new Map<string, 'masculino' | 'femenino'>([
  ['a', 'masculino'],
  ['b', 'masculino'],
  ['c', 'femenino'],
]);

describe('construirMapaForma', () => {
  const jornadas = [jornada('j1', 1, 'Soto'), jornada('j2', 2, 'Attraction')];

  it('una fila por jugador del sexo elegido, los que más ganan arriba, y una casilla por jornada', () => {
    const mapa = construirMapaForma(
      jornadas,
      [
        partido('a', 'Pablo', 'j1', false),
        partido('b', 'Alex', 'j2', true),
        partido('c', 'Vir', 'j1', true),
      ],
      SEXOS,
      'masculino',
    );
    expect(mapa.jugadores.map((j) => j.nombreMostrar)).toEqual(['Alex', 'Pablo']);
    expect(mapa.jornadas.map((j) => j.etiqueta)).toEqual(['J1', 'J2']);
    expect(mapa.celdas.map((c) => `${c.fila}${c.columna}:${c.estado}`)).toEqual([
      '00:no-jugo',
      '01:ganado',
      '10:perdido',
      '11:no-jugo',
    ]);
  });

  it('describe cada casilla, también los WO y las jornadas sin número', () => {
    const mapa = construirMapaForma(
      [jornada('j1', null, 'Soto')],
      [partido('a', 'Pablo', 'j1', true, { esWo: true, marcador: null })],
      SEXOS,
      'masculino',
    );
    expect(mapa.jornadas[0]?.etiqueta).toBe('Soto');
    expect(mapa.celdas[0]?.detalle).toBe('Pablo, Soto contra Soto: ganó por WO con Iván');
  });

  it('ignora los partidos de jornadas que no están y no inventa filas', () => {
    const mapa = construirMapaForma(
      jornadas,
      [partido('a', 'Pablo', 'otra', true)],
      SEXOS,
      'masculino',
    );
    expect(mapa.jugadores).toEqual([]);
    expect(mapa.celdas).toEqual([]);
  });
});
