import type { EChartsCoreOption } from 'echarts/core';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import type { EquipoGrupo } from '../interfaces/equipo-grupo.interface';
import { describirEquipoGrupo } from './partidos-grupo';

/** Alto de cada barra: se toca con el dedo. */
export const ALTO_FILA_GRUPO = 44;

/**
 * Nosotros contra el grupo: una barra por equipo que sale del centro hacia la derecha con los
 * partidos a favor (verde oscuro) y hacia la izquierda con los partidos en contra (naranja).
 * Los equipos van de mejor a peor diferencia y el nuestro en negrita, para verlo enseguida.
 */
export function opcionesGrupo(
  equipos: readonly EquipoGrupo[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const comunes = opcionesComunes(colores, animar);
  const maximo = Math.max(1, ...equipos.flatMap((e) => [e.favor, e.contra]));
  const nuestro = new Set(equipos.filter((e) => e.equipo.esNuestro).map((e) => e.equipo.nombre));
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        describirEquipoGrupo(equipos[dataIndex]),
    },
    legend: { top: 0, left: 0, itemWidth: 14, itemHeight: 14, textStyle: { color: colores.tinta } },
    grid: { left: 4, right: 4, top: 32, bottom: 4, containLabel: true },
    // Hueco a cada lado para que los números de los extremos no se corten.
    xAxis: { type: 'value', min: -maximo - 2, max: maximo + 2, show: false },
    yAxis: {
      type: 'category',
      inverse: true,
      data: equipos.map((e) => e.equipo.nombre),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colores.bordeFuerte } },
      axisLabel: {
        interval: 0,
        color: colores.tinta,
        formatter: (nombre: string): string =>
          nuestro.has(nombre) ? `{nuestro|${nombre}}` : nombre,
        rich: { nuestro: { fontWeight: 800, color: colores.pistaOscuro } },
      },
    },
    series: [
      {
        type: 'bar',
        name: 'A favor',
        stack: 'partidos',
        barWidth: 24,
        itemStyle: { color: colores.pistaOscuro, borderRadius: [0, 6, 6, 0] },
        label: { show: true, position: 'right', color: colores.tinta, fontWeight: 700 },
        data: equipos.map((e) => e.favor),
      },
      {
        type: 'bar',
        name: 'En contra',
        stack: 'partidos',
        barWidth: 24,
        itemStyle: { color: colores.derrota, borderRadius: [6, 0, 0, 6] },
        label: {
          show: true,
          position: 'left',
          color: colores.tinta,
          fontWeight: 700,
          formatter: ({ value }: { value: number }): string => String(Math.abs(value)),
        },
        data: equipos.map((e) => -e.contra),
      },
    ],
  };
}
