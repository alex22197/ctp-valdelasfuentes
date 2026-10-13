import { type FilaPlantillaConvocable, mapearConvocables } from './disponibilidad.mapper';

function enPlantilla(
  id: string,
  cambios: Partial<Omit<FilaPlantillaConvocable, 'jugador'>> = {},
): FilaPlantillaConvocable {
  return {
    comodin: false,
    baja: null,
    inscrito_oficial: null,
    jugador: { id, nombre_mostrar: id, sexo: 'masculino' },
    ...cambios,
  };
}

const HOY = '2026-10-08';

describe('mapearConvocables', () => {
  it('incluye a los comodines con su inscripción oficial', () => {
    const lista = mapearConvocables(
      [enPlantilla('jess', { comodin: true, inscrito_oficial: false }), enPlantilla('diego')],
      [],
      HOY,
    );
    expect(lista.map((j) => [j.id, j.comodin, j.inscritoOficial])).toEqual([
      ['jess', true, false],
      ['diego', false, null],
    ]);
  });

  it('marca a los convocados', () => {
    const lista = mapearConvocables(
      [enPlantilla('sergio'), enPlantilla('juan')],
      [
        { jugador_id: 'sergio', convocado: true },
        { jugador_id: 'juan', convocado: false },
      ],
      HOY,
    );
    expect(lista.map((j) => [j.id, j.convocado])).toEqual([
      ['sergio', true],
      ['juan', false],
    ]);
  });

  it('deja fuera a quien ya se dio de baja, salvo que esté convocado', () => {
    const lista = mapearConvocables(
      [
        enPlantilla('baja-convocado', { baja: '2026-10-01' }),
        enPlantilla('baja', { baja: '2026-10-01' }),
        enPlantilla('baja-manana', { baja: '2026-10-09' }),
      ],
      [{ jugador_id: 'baja-convocado', convocado: true }],
      HOY,
    );
    expect(lista.map((j) => j.id)).toEqual(['baja-convocado', 'baja-manana']);
  });
});
