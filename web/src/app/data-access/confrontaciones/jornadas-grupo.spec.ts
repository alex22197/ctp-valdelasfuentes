import type { EnfrentamientoGrupo } from './interfaces/enfrentamiento-grupo.interface';
import { agruparPorJornada, ultimaJornadaConResultados } from './jornadas-grupo';

const equipo = (nombre: string, esNuestro = false) => ({ id: nombre, nombre, esNuestro });

const enfrentamiento = (
  id: string,
  jornada: number | null,
  nuestro = false,
): EnfrentamientoGrupo => ({
  id,
  jornada,
  local: equipo(`Local ${id}`),
  visitante: equipo(nuestro ? 'CTPA' : `Visitante ${id}`, nuestro),
  estado: 'jugada',
  marcador: null,
});

describe('agruparPorJornada', () => {
  it('agrupa por jornada, en orden, con el nuestro primero', () => {
    const jornadas = agruparPorJornada([
      enfrentamiento('a', 2),
      enfrentamiento('b', 1),
      enfrentamiento('c', 2, true),
      enfrentamiento('d', 1, true),
    ]);
    expect(jornadas.map((j) => [j.titulo, j.enfrentamientos.map((e) => e.id)])).toEqual([
      ['Jornada 1', ['d', 'b']],
      ['Jornada 2', ['c', 'a']],
    ]);
  });

  it('las eliminatorias, sin número, van al final', () => {
    const jornadas = agruparPorJornada([enfrentamiento('x', null), enfrentamiento('y', 3)]);
    expect(jornadas.map((j) => j.titulo)).toEqual(['Jornada 3', 'Eliminatoria']);
  });

  it('sin enfrentamientos, nada', () => {
    expect(agruparPorJornada([])).toEqual([]);
  });
});

describe('ultimaJornadaConResultados', () => {
  const jugado = (id: string, jornada: number): EnfrentamientoGrupo => ({
    ...enfrentamiento(id, jornada),
    marcador: { local: 4, visitante: 2 },
  });

  it('elige la última jornada con algún resultado, aunque le falten otros', () => {
    const jornadas = agruparPorJornada([
      jugado('a', 1),
      jugado('b', 2),
      enfrentamiento('c', 2),
      enfrentamiento('d', 3),
    ]);
    expect(ultimaJornadaConResultados(jornadas)?.titulo).toBe('Jornada 2');
  });

  it('sin ningún resultado no hay jornada que enseñar', () => {
    expect(ultimaJornadaConResultados(agruparPorJornada([enfrentamiento('a', 1)]))).toBeNull();
    expect(ultimaJornadaConResultados([])).toBeNull();
  });
});
