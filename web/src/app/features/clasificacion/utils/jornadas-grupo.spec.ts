import type { EnfrentamientoGrupo } from '@data-access/confrontaciones/interfaces/enfrentamiento-grupo.interface';
import { agruparPorJornada } from './jornadas-grupo';

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
