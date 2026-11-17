import { type FilaPlantillaGestion, mapearJugadorGestion } from './jugador-gestion.mapper';

const jugador = {
  id: 'olga',
  nombre_mostrar: 'Olga',
  sexo: 'femenino' as const,
  lado_preferido: null,
};

function fila(cambios: Partial<FilaPlantillaGestion> = {}): FilaPlantillaGestion {
  return {
    comodin: true,
    inscrito_oficial: null,
    baja: null,
    jugador: { ...jugador, jugador_privado: null },
    ...cambios,
  };
}

describe('mapearJugadorGestion', () => {
  it('pasa la situación en la plantilla y el nombre completo, si lo hay', () => {
    expect(mapearJugadorGestion(fila())).toEqual({
      id: 'olga',
      nombreMostrar: 'Olga',
      nombreCompleto: null,
      sexo: 'femenino',
      ladoPreferido: null,
      comodin: true,
      inscritoOficial: null,
      baja: null,
    });
    const conNombre = fila({
      jugador: { ...jugador, jugador_privado: { nombre_completo: 'Olga Martín' } },
      baja: '2026-11-17',
    });
    expect(mapearJugadorGestion(conNombre)).toMatchObject({
      nombreCompleto: 'Olga Martín',
      baja: '2026-11-17',
    });
  });

  it('admite el nombre completo también como lista', () => {
    const enLista = fila({
      jugador: { ...jugador, jugador_privado: [{ nombre_completo: 'Olga Martín' }] },
    });
    expect(mapearJugadorGestion(enLista).nombreCompleto).toBe('Olga Martín');
  });
});
