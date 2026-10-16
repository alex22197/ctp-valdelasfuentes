import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';
import { diaDeJuego, elegirProximaConfrontacion } from './proxima-confrontacion';

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

const HOY = '2026-10-16';
const numero = (calendario: ConfrontacionNuestroEquipo[]): number | null | undefined =>
  elegirProximaConfrontacion(calendario, HOY)?.jornada;

describe('elegirProximaConfrontacion', () => {
  it('salta las jornadas ya jugadas', () => {
    const calendario = [jornada(1, 'jugada'), jornada(2, 'programada'), jornada(3, 'programada')];
    expect(numero(calendario)).toBe(2);
  });

  it('elige por fecha, no por número de jornada', () => {
    const calendario = [
      jornada(2, 'programada', { fechaPrevista: '2026-10-31' }),
      jornada(3, 'programada', { fechaHora: '2026-10-18T11:30:00Z' }),
    ];
    expect(numero(calendario)).toBe(3);
  });

  it('una jornada de hace días sin resultados no es la próxima', () => {
    const calendario = [
      jornada(1, 'programada', { fechaPrevista: '2026-10-10' }),
      jornada(2, 'programada', { fechaPrevista: '2026-10-18' }),
    ];
    expect(numero(calendario)).toBe(2);
  });

  it('la de hoy sigue siendo la próxima', () => {
    expect(numero([jornada(2, 'programada', { fechaHora: '2026-10-16T18:00:00Z' })])).toBe(2);
  });

  it('una aplazada sin fecha nueva va detrás de las que tienen fecha', () => {
    const calendario = [
      jornada(1, 'aplazada', { fechaPrevista: '2026-10-10' }),
      jornada(2, 'programada', { fechaPrevista: '2026-10-24' }),
    ];
    expect(numero(calendario)).toBe(2);
    expect(numero([jornada(1, 'aplazada', { fechaPrevista: '2026-10-10' })])).toBe(1);
  });

  it('sin fechas, por número de jornada', () => {
    expect(numero([jornada(4, 'programada'), jornada(3, 'programada')])).toBe(3);
  });

  it('devuelve null cuando ya se ha jugado todo', () => {
    expect(elegirProximaConfrontacion([jornada(1, 'jugada')], HOY)).toBeNull();
  });
});

describe('diaDeJuego', () => {
  it('usa el día de Madrid de la hora real', () => {
    expect(diaDeJuego(jornada(1, 'programada', { fechaHora: '2026-10-10T22:30:00Z' }), HOY)).toBe(
      '2026-10-11',
    );
  });

  it('una aplazada que ya pasó queda por confirmar', () => {
    expect(diaDeJuego(jornada(1, 'aplazada', { fechaPrevista: '2026-10-10' }), HOY)).toBeNull();
    expect(diaDeJuego(jornada(1, 'aplazada', { fechaPrevista: '2026-11-01' }), HOY)).toBe(
      '2026-11-01',
    );
  });
});
