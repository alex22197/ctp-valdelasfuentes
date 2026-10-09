import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { agruparRespuestas } from './grupos-respuestas';

function jugador(nombreMostrar: string, cambios: Partial<JugadorConvocable>): JugadorConvocable {
  return {
    id: nombreMostrar,
    nombreMostrar,
    sexo: 'masculino',
    respuesta: null,
    convocado: false,
    comodin: false,
    inscritoOficial: true,
    ...cambios,
  };
}

describe('agruparRespuestas', () => {
  it('reparte a cada jugador en su grupo, con los comodines solo si están convocados', () => {
    const grupos = agruparRespuestas([
      jugador('Sergio', { respuesta: 'si', convocado: true }),
      jugador('Jess', { comodin: true, convocado: true }),
      jugador('Walter', { respuesta: 'si' }),
      jugador('Juan', { respuesta: 'no' }),
      jugador('Diego', {}),
      jugador('Ana', { comodin: true }),
    ]);
    expect(grupos.map((g) => [g.titulo, g.jugadores.map((j) => j.nombreMostrar)])).toEqual([
      ['Convocados', ['Jess', 'Sergio']],
      ['Pueden ir, sin convocar', ['Walter']],
      ['No pueden', ['Juan']],
      ['Sin responder', ['Diego']],
    ]);
  });
});
