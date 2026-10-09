import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import { textoConvocatoria, textoRecordatorio } from './texto-whatsapp';

function jugador(nombreMostrar: string): JugadorConvocable {
  return {
    id: nombreMostrar,
    nombreMostrar,
    sexo: 'masculino',
    respuesta: 'si',
    convocado: true,
    comodin: false,
    inscritoOficial: true,
  };
}

function hueco(tipo: TipoPartido, numero: number, reves: string, drive: string): HuecoAlineacion {
  return { tipo, numero, idReves: reves, idDrive: drive, bloqueado: false };
}

// Convocatoria real de la jornada 1, con los nombres tal como están en la base de datos.
const huecosJornada1 = [
  hueco('masculino', 1, 'Sergio', 'Jorge'),
  hueco('masculino', 2, 'Alex', 'Pablo'),
  hueco('masculino', 3, 'Álvaro', 'Joel'),
  hueco('femenino', 1, 'Marta Prieto', 'Vir'),
  hueco('femenino', 2, 'Marta Morales', 'Jess'),
  hueco('mixto', 1, 'Rocio', 'Ivan G'),
];
const convocablesJornada1 = huecosJornada1.flatMap((h) => [
  jugador(h.idReves!),
  jugador(h.idDrive!),
]);
const jornada1 = {
  rival: { id: 'soto', nombre: 'Soto Torrejón', esNuestro: false },
  fechaHora: '2026-10-10T10:00:00Z',
  fechaPrevista: '2026-10-10',
  numeroPistas: 6,
};

describe('textoConvocatoria', () => {
  it('reproduce la convocatoria de la jornada 1 con el formato del capitán', () => {
    expect(textoConvocatoria(jornada1, huecosJornada1, convocablesJornada1)).toBe(
      [
        'vs Soto Torrejón, sábado 12:00, los 6 a la vez',
        '(revés - drive)',
        'Masculino 1: Sergio - Jorge',
        'Masculino 2: Alex - Pablo',
        'Masculino 3: Álvaro - Joel',
        'Femenino 1: Marta Prieto - Vir',
        'Femenino 2: Marta Morales - Jess',
        'Mixto: Rocio - Ivan G',
      ].join('\n'),
    );
  });

  it('con menos de 6 pistas sigue el orden de juego de la normativa', () => {
    const lineas = textoConvocatoria(
      { ...jornada1, numeroPistas: 3 },
      huecosJornada1,
      convocablesJornada1,
    ).split('\n');
    expect(lineas[0]).toBe('vs Soto Torrejón, sábado 12:00');
    expect(lineas.slice(2).map((l) => l.split(':')[0])).toEqual([
      'Femenino 1',
      'Masculino 1',
      'Mixto',
      'Femenino 2',
      'Masculino 2',
      'Masculino 3',
    ]);
  });

  it('marca los huecos vacíos y las pistas con WO en contra', () => {
    const texto = textoConvocatoria(
      { ...jornada1, fechaHora: null, numeroPistas: null },
      [
        { tipo: 'masculino', numero: 1, idReves: 'Sergio', idDrive: null, bloqueado: false },
        { tipo: 'masculino', numero: 3, idReves: null, idDrive: null, bloqueado: true },
      ],
      convocablesJornada1,
    );
    expect(texto).toBe(
      [
        'vs Soto Torrejón, fin de semana del 10 de octubre',
        '(revés - drive)',
        'Masculino 1: Sergio - ?',
        'Masculino 3: WO',
      ].join('\n'),
    );
  });
});

describe('textoRecordatorio', () => {
  it('nombra a quien falta por contestar', () => {
    expect(
      textoRecordatorio(jornada1, [jugador('Diego'), jugador('Juan'), jugador('Walter')]),
    ).toBe(
      'Falta por contestar a la encuesta del partido contra Soto Torrejón (sábado 12:00): Diego, Juan y Walter. ¿Podéis decir si vais?',
    );
  });

  it('no genera nada si han contestado todos', () => {
    expect(textoRecordatorio(jornada1, [])).toBe('');
  });
});
