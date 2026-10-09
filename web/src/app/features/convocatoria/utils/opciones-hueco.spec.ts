import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { opcionesParaPista } from './opciones-hueco';

function jugador(
  nombreMostrar: string,
  sexo: JugadorConvocable['sexo'],
  cambios: Partial<JugadorConvocable> = {},
): JugadorConvocable {
  return {
    id: nombreMostrar,
    nombreMostrar,
    sexo,
    respuesta: 'si',
    convocado: false,
    comodin: false,
    inscritoOficial: true,
    ...cambios,
  };
}

const convocables = [
  jugador('Walter', 'masculino'),
  jugador('Diego', 'masculino', { respuesta: null }),
  jugador('Juan', 'masculino', { respuesta: 'no' }),
  jugador('Álvaro', 'masculino'),
  jugador('Rocio', 'femenino'),
  jugador('Jess', 'femenino', { comodin: true, respuesta: null }),
];

describe('opcionesParaPista', () => {
  it('agrupa por respuesta, ordena por nombre y filtra por sexo', () => {
    const grupos = opcionesParaPista('masculino', 'masculino-1', [], convocables);
    expect(grupos.map((g) => [g.titulo, g.opciones.map((o) => o.etiqueta)])).toEqual([
      ['Pueden', ['Álvaro', 'Walter']],
      ['Sin responder', ['Diego']],
      ['No pueden', ['Juan']],
    ]);
  });

  it('en el mixto ofrece chicos y chicas, con los comodines al final', () => {
    const grupos = opcionesParaPista('mixto', 'mixto-1', [], convocables);
    expect(grupos.map((g) => g.titulo)).toEqual([
      'Pueden',
      'Sin responder',
      'No pueden',
      'Comodines',
    ]);
    expect(grupos[0]?.opciones.map((o) => o.id)).toContain('Rocio');
  });

  it('indica en qué otra pista está ya cada jugador, pero no la propia', () => {
    const huecos = [
      { tipo: 'masculino' as const, numero: 1, idReves: 'Walter', idDrive: null, bloqueado: false },
      { tipo: 'masculino' as const, numero: 2, idReves: 'Álvaro', idDrive: null, bloqueado: false },
    ];
    const etiquetas = opcionesParaPista(
      'masculino',
      'masculino-1',
      huecos,
      convocables,
    )[0]?.opciones.map((o) => o.etiqueta);
    expect(etiquetas).toEqual(['Álvaro (en Masculino 2)', 'Walter']);
  });
});
