import type { PartidoEquipo } from '@data-access/estadisticas/interfaces/partido-equipo.interface';
import { balanceCasaFuera, balancePorCategoria, partidosAjustados } from './balance-equipo';

const partido = (cambios: Partial<PartidoEquipo>): PartidoEquipo => ({
  confrontacionId: 'c',
  faseId: 'f',
  jornada: 1,
  condicion: 'local',
  tipo: 'masculino',
  numero: 1,
  ganado: true,
  esWo: false,
  setsJugados: 2,
  setsGanados: 2,
  setsPerdidos: 0,
  tiebreaksJugados: 0,
  tiebreaksGanados: 0,
  ...cambios,
});

const partidos = [
  partido({}),
  partido({
    ganado: false,
    setsJugados: 3,
    setsGanados: 1,
    setsPerdidos: 2,
    tiebreaksJugados: 2,
    tiebreaksGanados: 1,
  }),
  partido({ condicion: 'visitante', tipo: 'femenino', esWo: true, setsJugados: 0, setsGanados: 0 }),
  partido({ condicion: 'visitante', tipo: 'mixto', ganado: false, tiebreaksJugados: 1 }),
];

describe('balanceCasaFuera', () => {
  it('reparte por casa y fuera, con los WO', () => {
    expect(balanceCasaFuera(partidos)).toEqual([
      { nombre: 'En casa', ganados: 1, perdidos: 1 },
      { nombre: 'Fuera', ganados: 1, perdidos: 1 },
    ]);
  });
});

describe('balancePorCategoria', () => {
  it('reparte por masculino, femenino y mixto', () => {
    expect(
      balancePorCategoria(partidos).map((f) => `${f.nombre} ${f.ganados}-${f.perdidos}`),
    ).toEqual(['Masculino 1-1', 'Femenino 1-0', 'Mixto 0-1']);
  });
});

describe('partidosAjustados', () => {
  it('cuenta los partidos en dos y tres sets y los tie-breaks, sin los WO', () => {
    expect(partidosAjustados(partidos)).toEqual([
      { nombre: 'En dos sets', ganados: 1, perdidos: 1 },
      { nombre: 'A tres sets', ganados: 0, perdidos: 1 },
      { nombre: 'Tie-breaks', ganados: 1, perdidos: 2 },
    ]);
  });
});
