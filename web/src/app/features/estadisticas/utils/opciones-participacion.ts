import type { EChartsCoreOption } from 'echarts/core';
import type { ParticipacionJugador } from '@data-access/estadisticas/interfaces/participacion-jugador.interface';
import type { ColoresGraficas } from '../interfaces/colores-graficas.interface';
import { opcionesComunes } from './opciones-comunes';

/** Alto de cada barra de jugador en píxeles. */
export const ALTO_FILA_PARTICIPACION = 32;

type Categoria = keyof Pick<
  ParticipacionJugador,
  'jugadas' | 'disponibleSinJugar' | 'noDisponible' | 'sinResponder'
>;

/** Las cuatro partes de cada barra, en el orden en que se leen. */
export const CATEGORIAS_PARTICIPACION: readonly { clave: Categoria; nombre: string }[] = [
  { clave: 'jugadas', nombre: 'Jugó' },
  { clave: 'disponibleSinJugar', nombre: 'Podía, sin convocar' },
  { clave: 'noDisponible', nombre: 'No podía' },
  { clave: 'sinResponder', nombre: 'Sin responder' },
];

/**
 * Una barra por jugador con las jornadas que jugó, las que podía sin ser convocado, las que
 * no podía y las que no respondió. Colores con claridades distintas para leerse sin color.
 */
export function opcionesParticipacion(
  participacion: readonly ParticipacionJugador[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const color: Record<Categoria, string> = {
    jugadas: colores.pistaOscuro,
    disponibleSinJugar: colores.mixto,
    noDisponible: colores.derrota,
    sinResponder: colores.bordeFuerte,
  };
  const comunes = opcionesComunes(colores, animar);
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    legend: { top: 0, left: 0, itemWidth: 14, itemHeight: 14, textStyle: { color: colores.tinta } },
    grid: { left: 4, right: 12, top: 56, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: colores.tintaTenue },
      splitLine: { lineStyle: { color: colores.borde } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      data: participacion.map((p) => p.nombreMostrar),
      axisTick: { show: false },
      axisLabel: { color: colores.tinta },
    },
    series: CATEGORIAS_PARTICIPACION.map(({ clave, nombre }) => ({
      type: 'bar',
      name: nombre,
      stack: 'jornadas',
      barMaxWidth: 22,
      itemStyle: { color: color[clave] },
      data: participacion.map((p) => p[clave]),
    })),
  };
}
