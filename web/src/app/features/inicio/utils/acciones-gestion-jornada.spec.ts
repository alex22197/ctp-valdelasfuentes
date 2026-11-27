import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from '@data-access/confrontaciones/interfaces/estado-confrontacion.type';
import { accionesGestionJornada } from './acciones-gestion-jornada';

const HOY = '2026-11-27';
const jornada = (estado: EstadoConfrontacion, fechaPrevista: string | null) =>
  ({ id: 'c1', estado, fechaPrevista, fechaHora: null }) as ConfrontacionNuestroEquipo;
const textos = (estado: EstadoConfrontacion, fecha: string | null): string[] =>
  accionesGestionJornada(jornada(estado, fecha), HOY).map((accion) => accion.texto);

describe('accionesGestionJornada', () => {
  it('antes del partido, solo la convocatoria', () => {
    expect(textos('programada', '2026-11-28')).toEqual(['Convocatoria']);
    expect(textos('aplazada', null)).toEqual(['Convocatoria']);
  });

  it('el día del partido, convocatoria y resultados', () => {
    expect(textos('programada', HOY)).toEqual(['Convocatoria', 'Meter resultados']);
  });

  it('cuando ya pasó, solo meter los resultados', () => {
    expect(textos('programada', '2026-11-22')).toEqual(['Meter resultados']);
  });

  it('terminada, solo corregirlos', () => {
    expect(textos('jugada', '2026-11-22')).toEqual(['Editar resultados']);
    expect(textos('no_comparecencia', '2026-11-22')).toEqual(['Editar resultados']);
  });

  it('cada acción lleva a la pantalla de esa jornada', () => {
    expect(accionesGestionJornada(jornada('programada', HOY), HOY).map((a) => a.ruta)).toEqual([
      ['/convocatoria', 'c1'],
      ['/resultados', 'c1'],
    ]);
  });
});
