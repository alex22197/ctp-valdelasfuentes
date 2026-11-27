import { describe, expect, it } from 'vitest';
import type { ContextoFase } from './interfaces/contexto-fase.interface.ts';
import { crucesNuestros, planificarEliminatoria } from './planificar-eliminatoria.ts';
import type { ConfrontacionConocida } from './interfaces/confrontacion-conocida.interface.ts';

const nosotros = { id: 'ctpa', nombre: 'CTPA Valdelasfuentes', nombreWeb: null, esNuestro: true };
const ssr = {
  id: 'ssr',
  nombre: 'San Sebastián de los Reyes "B"',
  nombreWeb: 'SAN SEBASTIÁN DE LOS REYES ¨B¨',
  esNuestro: false,
};
const cruce = (local: string, visitante: string, pl: number, pv: number) => ({
  local,
  visitante,
  partidosLocal: pl,
  partidosVisitante: pv,
});
const cruces = [
  cruce('PADELGON “C”', "Pa'delante", 2, 4),
  cruce('CTPA Valdelasfuentes', 'SAN SEBASTIÁN DE LOS REYES ¨B¨', 4, 2),
];
const contexto = (
  confrontaciones: ContextoFase['confrontaciones'],
  marcadores: ContextoFase['marcadores'] = [],
): ContextoFase => ({
  faseId: 'r',
  faseNombre: 'Retos',
  equipos: [nosotros, ssr],
  confrontaciones,
  marcadores,
});

describe('crucesNuestros', () => {
  it('se queda solo con los cruces en los que jugamos', () => {
    expect(crucesNuestros(cruces, [nosotros, ssr]).map((c) => c.local)).toEqual([
      'CTPA Valdelasfuentes',
    ]);
  });
});

describe('planificarEliminatoria', () => {
  it('crea nuestro cruce si falta, sin jornada ni marcador', () => {
    const plan = planificarEliminatoria(cruces, contexto([]));
    expect(plan.nuevas).toEqual([
      {
        jornada: null,
        localId: 'ctpa',
        visitanteId: 'ssr',
        partidosLocal: null,
        partidosVisitante: null,
        estado: 'programada',
      },
    ]);
    expect(plan.clasificacion).toEqual([]);
  });

  it('si ya existe, solo avisa cuando el marcador no coincide', () => {
    const reto: ConfrontacionConocida = {
      id: 'c',
      jornada: null,
      localId: 'ctpa',
      visitanteId: 'ssr',
      partidosLocal: null,
      partidosVisitante: null,
      estado: 'jugada',
    };
    const bien = planificarEliminatoria(
      cruces,
      contexto(
        [reto],
        [{ confrontacionId: 'c', partidosGanados: 4, partidosPerdidos: 2, partidosPendientes: 0 }],
      ),
    );
    expect(bien.nuevas).toEqual([]);
    expect(bien.avisos).toEqual([]);

    const mal = planificarEliminatoria(
      cruces,
      contexto(
        [reto],
        [{ confrontacionId: 'c', partidosGanados: 3, partidosPerdidos: 3, partidosPendientes: 0 }],
      ),
    );
    expect(mal.avisos).toEqual([
      'Retos CTPA Valdelasfuentes-San Sebastián de los Reyes "B": el marcador no coincide, la liga dice 4-2 y la web 3-3',
    ]);
  });

  it('ignora los cruces de otras divisiones aunque sus equipos no existan', () => {
    expect(() => planificarEliminatoria(cruces, contexto([]))).not.toThrow();
  });
});
