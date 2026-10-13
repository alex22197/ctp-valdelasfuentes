import type { EChartsCoreOption } from 'echarts/core';
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import type { EvolucionTemporada } from '../interfaces/evolucion-temporada.interface';

/**
 * Puntos acumulados jornada a jornada, una línea por fase: cada fase tiene su propia
 * clasificación, así que la cuenta vuelve a cero. Una jornada con partidos pendientes no
 * tiene puntos todavía: no suma y queda como hueco. Son puntos sin sanciones.
 */
export function construirEvolucion(jornadas: readonly JornadaJugada[]): EvolucionTemporada {
  const ordenes = [...new Set(jornadas.map((j) => j.faseOrden))];
  const fases = ordenes.map((orden) => {
    let acumulado = 0;
    return {
      nombre: jornadas.find((j) => j.faseOrden === orden)?.faseNombre ?? '',
      puntos: jornadas.map((j) => {
        if (j.faseOrden !== orden || j.puntos === null) {
          return null;
        }
        acumulado += j.puntos;
        return acumulado;
      }),
    };
  });
  return {
    confrontaciones: jornadas.map((j) => j.confrontacionId),
    etiquetas: jornadas.map((j) => (j.jornada ? `J${j.jornada}` : j.rival)),
    fases,
    ganados: jornadas.map((j) => j.partidosGanados),
  };
}

/**
 * Barras con los partidos ganados en cada jornada y, encima, la línea de puntos acumulados
 * de cada fase. Al tocar una jornada se ve su detalle debajo.
 */
export function opcionesEvolucion(
  evolucion: EvolucionTemporada,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const coloresLineas = [colores.pistaOscuro, colores.mixto, colores.derrota];
  return {
    ...opcionesComunes(colores, animar),
    tooltip: { triggerOn: 'click', confine: true, trigger: 'axis' },
    legend: { top: 0, left: 0, itemWidth: 14, itemHeight: 14, textStyle: { color: colores.tinta } },
    grid: { left: 4, right: 4, top: 56, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: evolucion.etiquetas,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colores.bordeFuerte } },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Puntos (sin sanciones)',
        nameTextStyle: { color: colores.tintaTenue, align: 'left' },
        minInterval: 1,
        axisLabel: { color: colores.tintaTenue },
        splitLine: { lineStyle: { color: colores.borde } },
      },
      { type: 'value', max: 6, show: false },
    ],
    series: [
      {
        type: 'bar',
        name: 'Partidos ganados',
        yAxisIndex: 1,
        barMaxWidth: 32,
        itemStyle: { color: colores.pistaSuave, borderRadius: [6, 6, 0, 0] },
        data: evolucion.ganados,
      },
      ...evolucion.fases.map((fase, indice) => ({
        type: 'line',
        name: fase.nombre,
        connectNulls: false,
        symbolSize: 12,
        lineStyle: { width: 3 },
        itemStyle: { color: coloresLineas[indice % coloresLineas.length] },
        label: { show: true, position: 'top', color: colores.tinta, fontWeight: 700 },
        data: fase.puntos,
      })),
    ],
  };
}
