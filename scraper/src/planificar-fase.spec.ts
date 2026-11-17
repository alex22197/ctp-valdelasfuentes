import { describe, expect, it } from 'vitest';
import type { ConfrontacionConocida } from './interfaces/confrontacion-conocida.interface.ts';
import type { ContextoFase } from './interfaces/contexto-fase.interface.ts';
import type { PaginaGrupo } from './interfaces/pagina-grupo.interface.ts';
import { planificarFase } from './planificar-fase.ts';
import { nombresDeGrupo, resolverEquipos } from './resolver-equipos.ts';

const nosotros = { id: 'ctpa', nombre: 'CTPA Valdelasfuentes', nombreWeb: null, esNuestro: true };
const padelgon = { id: 'pad', nombre: 'Padelgon "C"', nombreWeb: 'Padelgon "C"', esNuestro: false };
const soto = { id: 'soto', nombre: 'Soto Torrejón', nombreWeb: 'SOTO TORREJON', esNuestro: false };
const equipos = [nosotros, padelgon, soto];

const fila = (posicion: number, equipo: string, puntos: number) => ({
  posicion,
  equipo,
  puntos,
  ganados: 0,
  empatados: 0,
  perdidos: 0,
  partidosFavor: 0,
  partidosContra: 0,
});
const partido = (local: string, visitante: string, pl: number, pv: number) => ({
  local,
  visitante,
  partidosLocal: pl,
  partidosVisitante: pv,
});

const pagina: PaginaGrupo = {
  fase: 'Apertura',
  jornadas: [
    { numero: 1, confrontaciones: [partido('PADELGON “C”', 'SOTO TORREJON', 3, 3)] },
    { numero: 2, confrontaciones: [partido('SOTO TORREJON', 'CTPA Valdelasfuentes', 5, 1)] },
    { numero: 3, confrontaciones: [partido('CTPA Valdelasfuentes', 'PADELGON “C”', 0, 0)] },
  ],
  clasificacion: [
    fila(1, 'SOTO TORREJON', 4),
    fila(2, 'PADELGON “C”', 3),
    fila(3, 'CTPA Valdelasfuentes', 1),
  ],
};

const contexto = (
  confrontaciones: ConfrontacionConocida[],
  marcadores: ContextoFase['marcadores'] = [],
): ContextoFase => ({ faseId: 'f1', faseNombre: 'Apertura', equipos, confrontaciones, marcadores });

const conocida = (
  id: string,
  jornada: number,
  localId: string,
  visitanteId: string,
  cambios: Partial<ConfrontacionConocida> = {},
): ConfrontacionConocida => ({
  id,
  jornada,
  localId,
  visitanteId,
  partidosLocal: null,
  partidosVisitante: null,
  estado: 'programada',
  ...cambios,
});

describe('planificarFase', () => {
  it('copia la clasificación y crea las jornadas que faltan', () => {
    const plan = planificarFase(pagina, contexto([]));
    expect(plan.clasificacion.map((f) => [f.equipoId, f.posicion, f.puntos])).toEqual([
      ['soto', 1, 4],
      ['pad', 2, 3],
      ['ctpa', 3, 1],
    ]);
    expect(plan.nuevas).toEqual([
      {
        jornada: 1,
        localId: 'pad',
        visitanteId: 'soto',
        partidosLocal: 3,
        partidosVisitante: 3,
        estado: 'jugada',
      },
      {
        jornada: 2,
        localId: 'soto',
        visitanteId: 'ctpa',
        partidosLocal: null,
        partidosVisitante: null,
        estado: 'programada',
      },
      {
        jornada: 3,
        localId: 'ctpa',
        visitanteId: 'pad',
        partidosLocal: null,
        partidosVisitante: null,
        estado: 'programada',
      },
    ]);
    expect(plan.actualizadas).toEqual([]);
  });

  it('pone el resultado a las confrontaciones de otros cuando la liga lo publica', () => {
    const plan = planificarFase(pagina, contexto([conocida('c1', 1, 'pad', 'soto')]));
    expect(plan.actualizadas).toEqual([
      { id: 'c1', jornada: 1, partidosLocal: 3, partidosVisitante: 3 },
    ]);
  });

  it('no repite lo que ya está igual', () => {
    const igual = conocida('c1', 1, 'pad', 'soto', {
      partidosLocal: 3,
      partidosVisitante: 3,
      estado: 'jugada',
    });
    expect(planificarFase(pagina, contexto([igual])).actualizadas).toEqual([]);
  });

  it('en las nuestras no escribe el marcador: avisa si no coincide o si faltan partidos', () => {
    const nuestra = conocida('c2', 2, 'soto', 'ctpa', { estado: 'jugada' });
    const coincide = planificarFase(
      pagina,
      contexto(
        [nuestra],
        [{ confrontacionId: 'c2', partidosGanados: 1, partidosPerdidos: 5, partidosPendientes: 0 }],
      ),
    );
    expect(coincide.avisos).toEqual([]);
    expect(coincide.actualizadas).toEqual([]);

    const distinto = planificarFase(
      pagina,
      contexto(
        [nuestra],
        [{ confrontacionId: 'c2', partidosGanados: 2, partidosPerdidos: 4, partidosPendientes: 0 }],
      ),
    );
    expect(distinto.avisos).toEqual([
      'J2 Soto Torrejón-CTPA Valdelasfuentes: el marcador no coincide, la liga dice 5-1 y la web 4-2',
    ]);

    const incompleta = planificarFase(
      pagina,
      contexto(
        [nuestra],
        [{ confrontacionId: 'c2', partidosGanados: 1, partidosPerdidos: 3, partidosPendientes: 2 }],
      ),
    );
    expect(incompleta.avisos[0]).toMatch(/faltan 2 partidos/);
  });

  it('si en la web el partido está al revés, avisa y no lo toca', () => {
    const plan = planificarFase(pagina, contexto([conocida('c1', 1, 'soto', 'pad')]));
    expect(plan.nuevas.map((n) => n.jornada)).toEqual([2, 3]);
    expect(plan.avisos[0]).toMatch(/al revés/);
  });

  it('falla si un equipo no existe todavía', () => {
    expect(() =>
      planificarFase(pagina, { ...contexto([]), equipos: [nosotros, padelgon] }),
    ).toThrow(/SOTO TORREJON/);
  });
});

describe('resolverEquipos', () => {
  it('detecta los equipos nuevos y el texto de la liga de los conocidos', () => {
    const clausura: PaginaGrupo = {
      ...pagina,
      jornadas: [
        { numero: 1, confrontaciones: [partido('CTPA Valdelasfuentes', "Pa'delante ", 0, 0)] },
      ],
      clasificacion: [fila(1, 'Bamvolea Punta Chica A', 0), fila(2, 'PADELGON “C”', 0)],
    };
    expect(resolverEquipos(nombresDeGrupo(clausura), equipos)).toEqual({
      nuevos: ['Bamvolea Punta Chica A', "Pa'delante"],
      renombrados: [
        { id: 'pad', nombreWeb: 'PADELGON “C”' },
        { id: 'ctpa', nombreWeb: 'CTPA Valdelasfuentes' },
      ],
    });
  });
});
