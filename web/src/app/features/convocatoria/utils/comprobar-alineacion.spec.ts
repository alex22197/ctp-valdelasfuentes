import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import { comprobarAlineacion } from './comprobar-alineacion';

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

function hueco(
  tipo: TipoPartido,
  numero: number,
  idReves: string | null,
  idDrive: string | null,
  bloqueado = false,
): HuecoAlineacion {
  return { tipo, numero, idReves, idDrive, bloqueado };
}

const plantilla = [
  jugador('Sergio', 'masculino'),
  jugador('Jorge', 'masculino'),
  jugador('Rocio', 'femenino'),
  jugador('Vir', 'femenino'),
  jugador('Jess', 'femenino', { comodin: true, inscritoOficial: null }),
];

describe('comprobarAlineacion', () => {
  it('no encuentra nada en una alineación completa y correcta', () => {
    const huecos = [hueco('masculino', 1, 'Sergio', 'Jorge'), hueco('femenino', 1, 'Rocio', 'Vir')];
    expect(comprobarAlineacion(huecos, plantilla)).toEqual([]);
  });

  it('señala en su pista a quien juega dos partidos', () => {
    const problemas = comprobarAlineacion(
      [hueco('masculino', 1, 'Sergio', 'Jorge'), hueco('mixto', 1, 'Sergio', 'Rocio')],
      plantilla,
    );
    expect(problemas).toContainEqual({
      gravedad: 'error',
      clave: 'mixto-1',
      mensaje: 'Sergio ya juega en Masculino 1',
    });
  });

  it('comprueba el sexo según el tipo de partido y el mixto', () => {
    const problemas = comprobarAlineacion(
      [hueco('masculino', 1, 'Rocio', null), hueco('mixto', 1, 'Sergio', 'Jorge')],
      plantilla,
    );
    expect(problemas.filter((p) => p.gravedad === 'error').map((p) => p.mensaje)).toEqual([
      'Rocio no puede jugar un partido masculino',
      'El mixto lo juegan un chico y una chica',
    ]);
  });

  it('avisa de los huecos vacíos, sin contar las pistas con WO en contra', () => {
    const problemas = comprobarAlineacion(
      [hueco('masculino', 1, 'Sergio', null), hueco('masculino', 3, null, null, true)],
      plantilla,
    );
    expect(problemas).toEqual([{ gravedad: 'aviso', clave: null, mensaje: 'Falta 1 jugador' }]);
  });

  it('avisa de un comodín sin inscripción comprobada', () => {
    const mensajes = comprobarAlineacion(
      [hueco('femenino', 2, 'Vir', 'Jess'), hueco('masculino', 1, 'Sergio', 'Jorge')],
      plantilla,
    ).map((p) => p.mensaje);
    expect(mensajes).toContain(
      'Jess es comodín y no consta como inscrito oficialmente: si el rival lo reclama, se pierde el partido',
    );
  });
});
