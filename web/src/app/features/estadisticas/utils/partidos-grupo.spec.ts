import type { PartidosEquipoGrupo } from '@data-access/clasificacion/interfaces/partidos-equipo-grupo.interface';
import { describirEquipoGrupo, sumarPartidosDelGrupo } from './partidos-grupo';

const fila = (
  nombre: string,
  faseId: string,
  favor: number | null,
  contra: number | null,
  esNuestro = false,
): PartidosEquipoGrupo => ({
  faseId,
  equipo: { id: nombre, nombre, esNuestro },
  partidosFavor: favor,
  partidosContra: contra,
});

describe('sumarPartidosDelGrupo', () => {
  it('suma las fases y ordena por diferencia, después por partidos a favor', () => {
    const equipos = sumarPartidosDelGrupo([
      fila('CTPA', 'f1', 4, 8, true),
      fila('CTPA', 'f2', 6, 0, true),
      fila('Soto', 'f1', 8, 4),
      fila('Padelgon', 'f1', 4, 8),
      fila('Attraction', 'f1', 6, 6),
    ]);
    expect(
      equipos.map((e) => `${e.equipo.nombre} ${e.favor}-${e.contra} (${e.diferencia})`),
    ).toEqual(['Soto 8-4 (4)', 'CTPA 10-8 (2)', 'Attraction 6-6 (0)', 'Padelgon 4-8 (-4)']);
  });

  it('un equipo sin datos no sale; con solo uno de los dos, el otro cuenta como 0', () => {
    const equipos = sumarPartidosDelGrupo([
      fila('Nadie', 'f1', null, null),
      fila('Algo', 'f1', 3, null),
    ]);
    expect(equipos.map((e) => e.equipo.nombre)).toEqual(['Algo']);
    expect(equipos[0]).toMatchObject({ favor: 3, contra: 0, diferencia: 3 });
  });

  it('describe un equipo con el signo de la diferencia', () => {
    const [equipo] = sumarPartidosDelGrupo([fila('Soto', 'f1', 8, 4)]);
    expect(describirEquipoGrupo(equipo)).toBe('Soto: 8 partidos a favor y 4 en contra (+4)');
    expect(describirEquipoGrupo(undefined)).toBe('');
  });
});
