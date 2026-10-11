import type { EChartsCoreOption } from 'echarts/core';
import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { contarPartidos, opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import type { FaseTemporada } from '../interfaces/fase-temporada.interface';
import type { FilaTemporada } from '../interfaces/fila-temporada.interface';

/** Anillo de partidos ganados (verde oscuro) y perdidos (naranja), con el % en el centro. */
export function opcionesAnillo(
  resumen: ResumenJugador,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  return {
    ...opcionesComunes(colores, animar),
    series: [
      {
        type: 'pie',
        radius: ['58%', '82%'],
        avoidLabelOverlap: false,
        itemStyle: { borderColor: colores.superficie, borderWidth: 3 },
        label: { show: false },
        emphasis: { scale: true, scaleSize: 4, label: { show: false } },
        data: [
          {
            name: 'Ganados',
            value: resumen.ganados,
            itemStyle: { color: colores.pistaOscuro },
            label: {
              show: true,
              position: 'center',
              formatter: `${resumen.porcentajeVictorias ?? 0} %`,
              fontSize: 26,
              fontWeight: 800,
              color: colores.tinta,
            },
          },
          { name: 'Perdidos', value: resumen.perdidos, itemStyle: { color: colores.derrota } },
        ],
      },
    ],
    tooltip: {
      triggerOn: 'click',
      confine: true,
      formatter: ({ name, value }: { name: string; value: number }): string =>
        `${name}: ${contarPartidos(value)}`,
    },
  };
}

/**
 * Sets y juegos: una barra para cada uno, repartida entre ganados y perdidos. Se dibuja en
 * proporción (los juegos son muchos más que los sets) y cada parte lleva su número.
 */
export function opcionesSetsJuegos(
  resumen: ResumenJugador,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const filas = [
    { nombre: 'Sets', ganados: resumen.setsGanados, perdidos: resumen.setsPerdidos },
    { nombre: 'Juegos', ganados: resumen.juegosGanados, perdidos: resumen.juegosPerdidos },
  ];
  const parte = (fila: (typeof filas)[number], valor: number): number => {
    const total = fila.ganados + fila.perdidos;
    return total ? (100 * valor) / total : 0;
  };
  const serie = (
    nombre: string,
    clave: 'ganados' | 'perdidos',
    color: string,
    texto: string,
  ): object => ({
    type: 'bar',
    name: nombre,
    stack: 'total',
    barWidth: 28,
    itemStyle: { color },
    label: {
      show: true,
      color: texto,
      fontWeight: 700,
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        String(filas[dataIndex]?.[clave] ?? ''),
    },
    data: filas.map((fila) => parte(fila, fila[clave])),
  });
  return {
    ...opcionesComunes(colores, animar),
    tooltip: { show: false },
    legend: { top: 0, left: 0, itemWidth: 14, itemHeight: 14, textStyle: { color: colores.tinta } },
    grid: { left: 4, right: 4, top: 32, bottom: 4, containLabel: true },
    xAxis: { type: 'value', max: 100, show: false },
    yAxis: {
      type: 'category',
      inverse: true,
      data: filas.map((f) => f.nombre),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    series: [
      serie('Ganados', 'ganados', colores.pistaOscuro, colores.sobrePista),
      serie('Perdidos', 'perdidos', colores.derrota, colores.tinta),
    ],
  };
}

/**
 * Su temporada en barras: juegos ganados menos perdidos en cada jornada, verde si ganó y
 * naranja si perdió. Las jornadas que no jugó quedan vacías y los WO llevan «WO».
 */
export function opcionesTemporada(
  fases: readonly FaseTemporada[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const filas = fases.flatMap((fase) => fase.filas);
  return {
    ...opcionesComunes(colores, animar),
    tooltip: {
      triggerOn: 'click',
      confine: true,
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        describirJornada(filas[dataIndex]),
    },
    grid: { left: 4, right: 4, top: 24, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: filas.map((f) => (f.jornada ? `J${f.jornada}` : f.rival)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colores.bordeFuerte } },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: colores.tintaTenue },
      splitLine: { lineStyle: { color: colores.borde } },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 32,
        data: filas.map((fila) => datoTemporada(fila, colores)),
      },
    ],
  };
}

function datoTemporada(fila: FilaTemporada, colores: ColoresGraficas): object {
  if (fila.esWo) {
    return {
      value: 0,
      label: {
        show: true,
        position: 'top',
        formatter: 'WO',
        color: colores.tinta,
        fontWeight: 700,
      },
    };
  }
  if (fila.diferenciaJuegos === null) {
    return { value: null };
  }
  const gano = fila.resultado === 'ganado';
  return {
    value: fila.diferenciaJuegos,
    itemStyle: {
      color: gano ? colores.pistaOscuro : colores.derrota,
      borderRadius: fila.diferenciaJuegos >= 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
    },
    label: {
      show: true,
      position: fila.diferenciaJuegos >= 0 ? 'top' : 'bottom',
      formatter:
        fila.diferenciaJuegos > 0 ? `+${fila.diferenciaJuegos}` : String(fila.diferenciaJuegos),
      color: colores.tinta,
      fontWeight: 700,
    },
  };
}

/** «J1 contra Soto Torrejón: ganado, 3-6 7-5 6-3» o «… no jugó». */
export function describirJornada(fila: FilaTemporada | undefined): string {
  if (!fila) {
    return '';
  }
  const cuando = fila.jornada ? `J${fila.jornada} contra ${fila.rival}` : `Contra ${fila.rival}`;
  if (fila.resultado === 'no-jugo') {
    return `${cuando}: no jugó`;
  }
  const resultado = fila.resultado === 'ganado' ? 'ganado' : 'perdido';
  return `${cuando}: ${resultado}, ${fila.marcador ?? ''}`.trim();
}
