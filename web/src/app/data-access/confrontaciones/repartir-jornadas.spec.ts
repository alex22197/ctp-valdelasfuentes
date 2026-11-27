import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';
import { repartirJornadas } from './repartir-jornadas';

function jornada(
  numero: number,
  estado: EstadoConfrontacion,
  fechas: { fechaPrevista?: string; fechaHora?: string } = {},
): ConfrontacionNuestroEquipo {
  return {
    jornada: numero,
    estado,
    fechaPrevista: fechas.fechaPrevista ?? null,
    fechaHora: fechas.fechaHora ?? null,
  } as ConfrontacionNuestroEquipo;
}

const HOY = '2026-11-27';
const numeros = (lista: readonly ConfrontacionNuestroEquipo[]): (number | null)[] =>
  lista.map((j) => j.jornada);

describe('repartirJornadas', () => {
  it('el clausura real: la aplazada se juega después de la jornada 3', () => {
    const clausura = [
      jornada(1, 'aplazada', { fechaPrevista: '2026-11-29' }),
      jornada(2, 'jugada', { fechaHora: '2026-11-22T12:30:00Z' }),
      jornada(3, 'programada', { fechaHora: '2026-11-28T14:00:00Z' }),
    ];
    const { porJugar, disputadas } = repartirJornadas(clausura, HOY);
    expect(numeros(porJugar)).toEqual([3, 1]);
    expect(numeros(disputadas)).toEqual([2]);
  });

  it('las que no tienen fecha van al final de lo que queda por jugar', () => {
    const lista = [
      jornada(1, 'aplazada'),
      jornada(2, 'programada'),
      jornada(3, 'programada', { fechaPrevista: '2026-12-05' }),
    ];
    expect(numeros(repartirJornadas(lista, HOY).porJugar)).toEqual([3, 1, 2]);
  });

  it('la de hoy sigue por jugar', () => {
    const hoy = [jornada(3, 'programada', { fechaHora: '2026-11-27T17:00:00Z' })];
    expect(numeros(repartirJornadas(hoy, HOY).porJugar)).toEqual([3]);
  });

  it('una por jugar cuyo día pasó cuenta como disputada: le falta el resultado', () => {
    const pasada = [jornada(2, 'programada', { fechaPrevista: '2026-11-22' })];
    const { porJugar, disputadas } = repartirJornadas(pasada, HOY);
    expect(porJugar).toEqual([]);
    expect(numeros(disputadas)).toEqual([2]);
  });

  it('las disputadas, de la más reciente a la más antigua', () => {
    const apertura = [
      jornada(1, 'jugada', { fechaPrevista: '2026-10-10' }),
      jornada(2, 'no_comparecencia', { fechaPrevista: '2026-10-17' }),
      jornada(3, 'jugada', { fechaHora: '2026-10-24T10:00:00Z' }),
    ];
    expect(numeros(repartirJornadas(apertura, HOY).disputadas)).toEqual([3, 2, 1]);
  });

  it('disputadas sin fecha: por número, de la última a la primera, detrás de las que la tienen', () => {
    const lista = [
      jornada(1, 'jugada'),
      jornada(2, 'jugada'),
      jornada(3, 'jugada', { fechaPrevista: '2026-10-24' }),
    ];
    expect(numeros(repartirJornadas(lista, HOY).disputadas)).toEqual([3, 2, 1]);
  });
});
