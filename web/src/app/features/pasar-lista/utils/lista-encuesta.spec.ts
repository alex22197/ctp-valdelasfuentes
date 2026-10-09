import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import { agruparPorSexo, contarRespuestas } from './lista-encuesta';

function jugador(
  nombreMostrar: string,
  sexo: JugadorEncuesta['sexo'],
  respuesta: JugadorEncuesta['respuesta'] = null,
): JugadorEncuesta {
  return { id: nombreMostrar, nombreMostrar, sexo, respuesta, convocado: false };
}

describe('agruparPorSexo', () => {
  it('separa chicos y chicas y ordena por nombre en castellano', () => {
    const grupos = agruparPorSexo([
      jugador('Rocio', 'femenino'),
      jugador('Walter', 'masculino'),
      jugador('Álvaro', 'masculino'),
      jugador('Andrea', 'femenino'),
      jugador('Diego', 'masculino'),
    ]);
    expect(grupos.map((g) => g.titulo)).toEqual(['Chicos', 'Chicas']);
    expect(grupos[0]?.jugadores.map((j) => j.nombreMostrar)).toEqual(['Álvaro', 'Diego', 'Walter']);
    expect(grupos[1]?.jugadores.map((j) => j.nombreMostrar)).toEqual(['Andrea', 'Rocio']);
  });

  it('omite un grupo sin jugadores', () => {
    expect(agruparPorSexo([jugador('Diego', 'masculino')]).map((g) => g.sexo)).toEqual([
      'masculino',
    ]);
  });
});

describe('contarRespuestas', () => {
  it('cuenta quién puede, quién no y quién no ha contestado', () => {
    expect(
      contarRespuestas([
        jugador('A', 'masculino', 'si'),
        jugador('B', 'masculino', 'si'),
        jugador('C', 'masculino', 'no'),
        jugador('D', 'masculino'),
      ]),
    ).toEqual({ pueden: 2, noPueden: 1, sinResponder: 1, total: 4 });
  });
});
