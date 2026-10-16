import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from '@data-access/confrontaciones/interfaces/estado-confrontacion.type';
import { organizarJornadasGestion } from './jornadas-gestion';

const equipo = { id: 'e', nombre: 'Equipo', esNuestro: false };

function jornada(
  numero: number,
  estado: EstadoConfrontacion,
  fechas: { fechaPrevista?: string; fechaHora?: string } = {},
): ConfrontacionNuestroEquipo {
  return {
    id: `j${numero}`,
    jornada: numero,
    local: equipo,
    visitante: equipo,
    rival: equipo,
    condicion: 'local',
    estado,
    fechaPrevista: fechas.fechaPrevista ?? null,
    fechaHora: fechas.fechaHora ?? null,
    sede: null,
    numeroPistas: null,
    convocatoriaPublicada: false,
    marcador: null,
  };
}

const numeros = (jornadas: readonly ConfrontacionNuestroEquipo[]): (number | null)[] =>
  jornadas.map((j) => j.jornada);

describe('organizarJornadasGestion', () => {
  const calendario = [
    jornada(1, 'jugada', { fechaPrevista: '2026-10-03' }),
    jornada(2, 'programada', { fechaHora: '2026-10-10T10:00:00Z' }),
    jornada(3, 'programada', { fechaPrevista: '2026-10-17' }),
    jornada(4, 'programada'),
  ];

  it('la próxima es la primera por jugar que aún no ha pasado', () => {
    const { proxima, sinResultados } = organizarJornadasGestion(calendario, '2026-10-13');
    expect(proxima?.jornada).toBe(3);
    expect(numeros(sinResultados)).toEqual([2]);
  });

  it('la jornada de hoy se convoca y ya admite resultados', () => {
    const { proxima, sinResultados } = organizarJornadasGestion(calendario, '2026-10-10');
    expect(proxima?.jornada).toBe(2);
    expect(numeros(sinResultados)).toEqual([2]);
  });

  it('usa el día real en Madrid, no el de UTC', () => {
    const tarde = [jornada(5, 'programada', { fechaHora: '2026-10-10T22:30:00Z' })];
    expect(organizarJornadasGestion(tarde, '2026-10-10').sinResultados).toEqual([]);
    expect(organizarJornadasGestion(tarde, '2026-10-11').sinResultados).toHaveLength(1);
  });

  it('sin fecha conocida solo puede ser la próxima', () => {
    const sinFecha = [jornada(4, 'programada')];
    expect(organizarJornadasGestion(sinFecha, '2026-12-01')).toEqual({
      proxima: sinFecha[0],
      sinResultados: [],
    });
  });

  it('una aplazada que ya pasó no pide resultados hasta tener fecha nueva', () => {
    const conAplazada = [
      jornada(2, 'aplazada', { fechaPrevista: '2026-10-10' }),
      jornada(3, 'programada', { fechaPrevista: '2026-10-24' }),
    ];
    const { proxima, sinResultados } = organizarJornadasGestion(conAplazada, '2026-10-13');
    expect(proxima?.jornada).toBe(3);
    expect(sinResultados).toEqual([]);
  });

  it('las jugadas y los WO no piden nada', () => {
    const cerradas = [
      jornada(1, 'jugada', { fechaPrevista: '2026-10-03' }),
      jornada(2, 'no_comparecencia', { fechaPrevista: '2026-10-10' }),
    ];
    expect(organizarJornadasGestion(cerradas, '2026-10-13')).toEqual({
      proxima: null,
      sinResultados: [],
    });
  });
});
