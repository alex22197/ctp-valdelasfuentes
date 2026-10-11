import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import { leerColoresGraficas } from '@shared/utils/graficas/opciones-comunes';
import { construirEvolucion, opcionesEvolucion } from './evolucion-temporada';

const jornada = (
  id: string,
  faseOrden: number,
  numero: number,
  puntos: number | null,
  partidosGanados = 3,
): JornadaJugada => ({
  confrontacionId: id,
  faseId: `f${faseOrden}`,
  faseNombre: faseOrden === 1 ? 'Apertura' : 'Clausura',
  faseOrden,
  jornada: numero,
  rival: 'Soto Torrejón',
  condicion: 'local',
  partidosGanados,
  partidosPerdidos: 6 - partidosGanados,
  puntos,
});

describe('construirEvolucion', () => {
  it('acumula los puntos de cada fase por separado y deja huecos', () => {
    const evolucion = construirEvolucion([
      jornada('a1', 1, 1, 2, 4),
      jornada('a2', 1, 2, null, 2),
      jornada('a3', 1, 3, 1),
      jornada('c1', 2, 1, 0, 1),
    ]);
    expect(evolucion.etiquetas).toEqual(['J1', 'J2', 'J3', 'J1']);
    expect(evolucion.fases).toEqual([
      { nombre: 'Apertura', puntos: [2, null, 3, null] },
      { nombre: 'Clausura', puntos: [null, null, null, 0] },
    ]);
    expect(evolucion.ganados).toEqual([4, 2, 3, 1]);
    expect(evolucion.confrontaciones).toEqual(['a1', 'a2', 'a3', 'c1']);
  });

  it('sin jornadas no tiene fases', () => {
    expect(construirEvolucion([]).fases).toEqual([]);
  });
});

describe('opcionesEvolucion', () => {
  it('dibuja las barras de ganados y una línea por fase sin unir los huecos', () => {
    const colores = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });
    const opciones = opcionesEvolucion(
      construirEvolucion([jornada('a1', 1, 1, 2), jornada('c1', 2, 1, 1)]),
      colores,
      true,
    ) as { series: { type: string; name: string; connectNulls?: boolean }[] };
    expect(opciones.series.map((s) => [s.type, s.name])).toEqual([
      ['bar', 'Partidos ganados'],
      ['line', 'Apertura'],
      ['line', 'Clausura'],
    ]);
    expect(opciones.series[1]?.connectNulls).toBe(false);
  });
});
