import type { FilaConfrontacion } from './confrontacion.mapper';
import { mapearEnfrentamientoGrupo } from './enfrentamiento-grupo.mapper';

const equipo = (nombre: string, es_nuestro = false) => ({ id: nombre, nombre, es_nuestro });

const fila = (cambios: Partial<FilaConfrontacion> = {}): FilaConfrontacion => ({
  id: 'c',
  jornada: 1,
  estado: 'jugada',
  fecha_prevista: null,
  fecha_hora: null,
  sede: null,
  num_pistas: null,
  partidos_local: null,
  partidos_visitante: null,
  convocatoria_publicada: false,
  local: equipo('Padelgon "C"'),
  visitante: equipo('Padel Attraction B'),
  ...cambios,
});

describe('mapearEnfrentamientoGrupo', () => {
  it('el de otros equipos lleva el marcador apuntado de la liga', () => {
    const enfrentamiento = mapearEnfrentamientoGrupo(
      fila({ partidos_local: 1, partidos_visitante: 5 }),
    );
    expect(enfrentamiento.marcador).toEqual({ local: 1, visitante: 5 });
    expect(enfrentamiento.local.nombre).toBe('Padelgon "C"');
  });

  it('sin marcador apuntado, por jugar', () => {
    expect(mapearEnfrentamientoGrupo(fila({ estado: 'programada' })).marcador).toBeNull();
  });

  it('el nuestro de visitante sale de nuestros resultados, de local a visitante', () => {
    const nuestro = fila({ local: equipo('Soto Torrejón'), visitante: equipo('CTPA', true) });
    const enfrentamiento = mapearEnfrentamientoGrupo(nuestro, {
      partidos_ganados: 1,
      partidos_perdidos: 5,
      partidos_pendientes: 0,
    });
    expect(enfrentamiento.marcador).toEqual({ local: 5, visitante: 1 });
  });

  it('el nuestro con partidos pendientes y sin marcador de la liga, sin marcador', () => {
    const nuestro = fila({ local: equipo('CTPA', true), visitante: equipo('Padelgon') });
    expect(
      mapearEnfrentamientoGrupo(nuestro, {
        partidos_ganados: 2,
        partidos_perdidos: 1,
        partidos_pendientes: 3,
      }).marcador,
    ).toBeNull();
  });
});
