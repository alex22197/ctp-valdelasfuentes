import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import {
  agruparPorFase,
  aplanarCalendario,
  conFaseActual,
  ultimaJugada,
} from './calendario-competicion';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';

const fase = (orden: number, tipo: Fase['tipo'] = 'apertura'): Fase => ({
  id: `f${orden}`,
  tipo,
  nombre: `Fase ${orden}`,
  orden,
  urlGrupo: null,
  inicio: null,
  fin: null,
});

const equipo = { id: 'e', nombre: 'Rival', esNuestro: false };

const confrontacion = (
  id: string,
  estado: ConfrontacionNuestroEquipo['estado'] = 'jugada',
): ConfrontacionNuestroEquipo => ({
  id,
  jornada: null,
  local: equipo,
  visitante: equipo,
  rival: equipo,
  condicion: 'local',
  estado,
  fechaPrevista: null,
  fechaHora: null,
  sede: null,
  numeroPistas: null,
  convocatoriaPublicada: false,
  marcador: null,
});

describe('agruparPorFase', () => {
  it('agrupa por fase en su orden y conserva el orden dentro de cada una', () => {
    const calendario = agruparPorFase([
      { fase: fase(2, 'retos'), confrontacion: confrontacion('r') },
      { fase: fase(1), confrontacion: confrontacion('j1') },
      { fase: fase(1), confrontacion: confrontacion('j2') },
    ]);
    expect(calendario.map((g) => [g.fase.id, g.confrontaciones.map((c) => c.id)])).toEqual([
      ['f1', ['j1', 'j2']],
      ['f2', ['r']],
    ]);
  });
});

describe('conFaseActual', () => {
  const apertura = { fase: fase(1), confrontaciones: [confrontacion('j1')] };

  it('añade la fase actual vacía si todavía no tiene partidos, en su sitio', () => {
    const calendario = conFaseActual([apertura], fase(2, 'retos'));
    expect(calendario.map((g) => [g.fase.id, g.confrontaciones.length])).toEqual([
      ['f1', 1],
      ['f2', 0],
    ]);
  });

  it('si ya está, no la repite', () => {
    expect(conFaseActual([apertura], fase(1))).toHaveLength(1);
  });
});

describe('aplanarCalendario y ultimaJugada', () => {
  const calendario = [
    { fase: fase(1), confrontaciones: [confrontacion('j1'), confrontacion('j2')] },
    { fase: fase(2, 'retos'), confrontaciones: [confrontacion('r', 'programada')] },
  ];

  it('pone todas seguidas, de la primera fase a la última', () => {
    expect(aplanarCalendario(calendario).map((c) => c.id)).toEqual(['j1', 'j2', 'r']);
  });

  it('la última jugada salta las que faltan por jugar', () => {
    expect(ultimaJugada(calendario)?.id).toBe('j2');
    expect(ultimaJugada([])).toBeNull();
  });
});
