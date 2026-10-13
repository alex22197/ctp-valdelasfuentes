import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import {
  construirTablaConvocatoria,
  convocatoriaCopiable,
  etiquetaPareja,
} from './tabla-convocatoria';

function hueco(
  tipo: TipoPartido,
  numero: number,
  idReves: string | null,
  idDrive: string | null,
  bloqueado = false,
): HuecoAlineacion {
  return { tipo, numero, idReves, idDrive, bloqueado };
}

// Convocatoria real de la jornada 1, con el nombre completo de quien lo tiene.
const huecosJornada1 = [
  hueco('masculino', 1, 'sergio', 'jorge'),
  hueco('masculino', 2, 'alex', 'pablo'),
  hueco('masculino', 3, 'alvaro', 'joel'),
  hueco('femenino', 1, 'marta-prieto', 'vir'),
  hueco('femenino', 2, 'marta-morales', 'jess'),
  hueco('mixto', 1, 'rocio', 'ivan-g'),
];
const nombres = new Map([
  ['sergio', 'Sergio'],
  ['jorge', 'Jorge'],
  ['alex', 'Alex'],
  ['pablo', 'Pablo Cristini'],
  ['alvaro', 'Álvaro'],
  ['joel', 'Joel'],
  ['marta-prieto', 'Marta Prieto'],
  ['vir', 'Virginia'],
  ['marta-morales', 'Marta Morales'],
  ['jess', 'Jess'],
  ['rocio', 'Rocio'],
  ['ivan-g', 'Iván Guadalix'],
]);
const jornada1 = {
  rival: { id: 'soto', nombre: 'Soto Torrejón', esNuestro: false },
  fechaHora: '2026-10-10T10:00:00Z',
  fechaPrevista: '2026-10-10',
  numeroPistas: 6,
};

describe('construirTablaConvocatoria', () => {
  it('reproduce la tabla de la jornada 1 del capitán', () => {
    expect(construirTablaConvocatoria(jornada1, huecosJornada1, nombres)).toEqual({
      titulo: 'vs SOTO TORREJÓN SÁBADO 12:00 LOS 6 A LA VEZ',
      filas: [
        { etiqueta: 'PAREJA 1 MASC.', tipo: 'masculino', reves: 'Sergio', drive: 'Jorge' },
        { etiqueta: 'PAREJA 2 MASC.', tipo: 'masculino', reves: 'Alex', drive: 'Pablo Cristini' },
        { etiqueta: 'PAREJA 3 MASC.', tipo: 'masculino', reves: 'Álvaro', drive: 'Joel' },
        { etiqueta: 'PAREJA 1 FEM.', tipo: 'femenino', reves: 'Marta Prieto', drive: 'Virginia' },
        { etiqueta: 'PAREJA 2 FEM.', tipo: 'femenino', reves: 'Marta Morales', drive: 'Jess' },
        { etiqueta: 'PAREJA MIXTO', tipo: 'mixto', reves: 'Rocio', drive: 'Iván Guadalix' },
      ],
    });
  });

  it('con menos pistas dice cuántas hay y ordena por turno de juego', () => {
    const tabla = construirTablaConvocatoria(
      { ...jornada1, numeroPistas: 3 },
      huecosJornada1,
      nombres,
    );
    expect(tabla.titulo).toBe('vs SOTO TORREJÓN SÁBADO 12:00 EN 3 PISTAS');
    expect(tabla.filas.map((f) => f.etiqueta)).toEqual([
      'PAREJA 1 FEM.',
      'PAREJA 1 MASC.',
      'PAREJA MIXTO',
      'PAREJA 2 FEM.',
      'PAREJA 2 MASC.',
      'PAREJA 3 MASC.',
    ]);
  });

  it('sin hora ni pistas usa la fecha prevista y no dice «a la vez»', () => {
    const tabla = construirTablaConvocatoria(
      { ...jornada1, fechaHora: null, numeroPistas: null },
      huecosJornada1,
      nombres,
    );
    expect(tabla.titulo).toBe('vs SOTO TORREJÓN FIN DE SEMANA DEL 10 DE OCTUBRE');
    expect(tabla.titulo).not.toContain('undefined');
  });

  it('escribe WO en una pista cerrada y «?» en un nombre desconocido', () => {
    const tabla = construirTablaConvocatoria(
      jornada1,
      [hueco('masculino', 3, null, null, true), hueco('mixto', 1, 'rocio', 'nuevo')],
      nombres,
    );
    expect(tabla.filas.map((f) => [f.reves, f.drive])).toEqual([
      ['WO', ''],
      ['Rocio', '?'],
    ]);
  });
});

describe('convocatoriaCopiable', () => {
  it('pide todas las parejas completas, o cerradas por WO, y sin cambios sin guardar', () => {
    expect(convocatoriaCopiable(huecosJornada1, false)).toBe(true);
    expect(convocatoriaCopiable(huecosJornada1, true)).toBe(false);
    expect(
      convocatoriaCopiable([hueco('masculino', 1, 'sergio', null), ...huecosJornada1], false),
    ).toBe(false);
    expect(
      convocatoriaCopiable([hueco('masculino', 1, null, null, true), ...huecosJornada1], false),
    ).toBe(true);
    expect(convocatoriaCopiable([], false)).toBe(false);
  });
});

describe('etiquetaPareja', () => {
  it('abrevia como en la hoja del capitán', () => {
    expect(etiquetaPareja('masculino', 2)).toBe('PAREJA 2 MASC.');
    expect(etiquetaPareja('femenino', 1)).toBe('PAREJA 1 FEM.');
    expect(etiquetaPareja('mixto', 1)).toBe('PAREJA MIXTO');
  });
});
