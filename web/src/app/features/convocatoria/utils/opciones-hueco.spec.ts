import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { filtrarOpciones, opcionesParaPista } from './opciones-hueco';

function jugador(
  nombreMostrar: string,
  sexo: JugadorConvocable['sexo'],
  cambios: Partial<JugadorConvocable> = {},
): JugadorConvocable {
  return {
    id: nombreMostrar,
    nombreMostrar,
    sexo,
    convocado: false,
    comodin: false,
    inscritoOficial: true,
    ...cambios,
  };
}

const convocables = [
  jugador('Walter', 'masculino'),
  jugador('Diego', 'masculino'),
  jugador('Álvaro', 'masculino'),
  jugador('Rocio', 'femenino'),
  jugador('Jess', 'femenino', { comodin: true }),
];

describe('opcionesParaPista', () => {
  it('ordena por nombre y filtra por sexo', () => {
    const grupos = opcionesParaPista('masculino', 'masculino-1', [], convocables);
    expect(grupos.map((g) => [g.estado, g.opciones.map((o) => o.nombre)])).toEqual([
      ['jugador', ['Álvaro', 'Diego', 'Walter']],
    ]);
    expect(grupos[0]?.opciones[0]).toEqual({
      id: 'Álvaro',
      nombre: 'Álvaro',
      iniciales: 'Ál',
      estado: 'jugador',
      otraPista: null,
    });
  });

  it('en el mixto ofrece chicos y chicas, con los comodines al final', () => {
    const grupos = opcionesParaPista('mixto', 'mixto-1', [], convocables);
    expect(grupos.map((g) => g.titulo)).toEqual(['Jugadores', 'Comodines']);
    expect(grupos[0]?.opciones.map((o) => o.id)).toContain('Rocio');
  });

  it('indica en qué otra pista está cada jugador, pero no la propia', () => {
    const huecos = [
      { tipo: 'masculino' as const, numero: 1, idReves: 'Walter', idDrive: null, bloqueado: false },
      { tipo: 'masculino' as const, numero: 2, idReves: 'Álvaro', idDrive: null, bloqueado: false },
    ];
    const jugadores = opcionesParaPista('masculino', 'masculino-1', huecos, convocables)[0];
    expect(jugadores?.opciones.map((o) => [o.nombre, o.otraPista])).toEqual([
      ['Álvaro', 'M2'],
      ['Diego', null],
      ['Walter', null],
    ]);
  });
});

describe('filtrarOpciones', () => {
  const grupos = opcionesParaPista('masculino', 'masculino-1', [], convocables);

  it('busca sin tener en cuenta tildes ni mayúsculas y quita los grupos vacíos', () => {
    expect(filtrarOpciones(grupos, 'ALVA').map((g) => g.opciones.map((o) => o.nombre))).toEqual([
      ['Álvaro'],
    ]);
  });

  it('sin búsqueda devuelve todo', () => {
    expect(filtrarOpciones(grupos, '  ')).toEqual(grupos);
  });
});
