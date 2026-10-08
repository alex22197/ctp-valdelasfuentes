import {
  type FilaDisponibilidad,
  type FilaPlantillaEncuesta,
  mapearListaEncuesta,
} from './disponibilidad.mapper';

function enPlantilla(
  id: string,
  cambios: Partial<Omit<FilaPlantillaEncuesta, 'jugador'>> = {},
): FilaPlantillaEncuesta {
  return {
    comodin: false,
    baja: null,
    jugador: { id, nombre_mostrar: id, sexo: 'masculino' },
    ...cambios,
  };
}

const HOY = '2026-10-08';

describe('mapearListaEncuesta', () => {
  it('pone a cada jugador su respuesta y deja sin responder a quien no tiene fila', () => {
    const disponibilidad: FilaDisponibilidad[] = [
      { jugador_id: 'sergio', respuesta: 'si', convocado: true },
      { jugador_id: 'juan', respuesta: 'no', convocado: false },
    ];
    const lista = mapearListaEncuesta(
      [enPlantilla('sergio'), enPlantilla('juan'), enPlantilla('diego')],
      disponibilidad,
      HOY,
    );
    expect(lista.map((j) => [j.id, j.respuesta, j.convocado])).toEqual([
      ['sergio', 'si', true],
      ['juan', 'no', false],
      ['diego', null, false],
    ]);
  });

  it('trata como sin responder a un convocado sin respuesta', () => {
    const lista = mapearListaEncuesta(
      [enPlantilla('sergio')],
      [{ jugador_id: 'sergio', respuesta: null, convocado: true }],
      HOY,
    );
    expect(lista[0]).toMatchObject({ respuesta: null, convocado: true });
  });

  it('deja fuera a los comodines y a quien ya se dio de baja', () => {
    const lista = mapearListaEncuesta(
      [
        enPlantilla('jess', { comodin: true }),
        enPlantilla('baja-ayer', { baja: '2026-10-07' }),
        enPlantilla('baja-manana', { baja: '2026-10-09' }),
      ],
      [],
      HOY,
    );
    expect(lista.map((j) => j.id)).toEqual(['baja-manana']);
  });
});
