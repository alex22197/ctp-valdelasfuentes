import type { EChartsCoreOption } from 'echarts/core';
import type { BalancePuestoEquipo } from '@data-access/estadisticas/interfaces/balance-puesto-equipo.interface';
import { nombrePareja } from '@shared/utils/etiquetas-partido';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { contarPartidos, opcionesComunes } from '@shared/utils/graficas/opciones-comunes';

/**
 * Barras horizontales con el porcentaje de victorias del equipo en cada pareja («Pareja 1
 * masculina»…, la mixta en lima). En horizontal caben los nombres enteros, sin códigos.
 */
export function opcionesPuestos(
  puestos: readonly BalancePuestoEquipo[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const comunes = opcionesComunes(colores, animar);
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        describirPuesto(puestos[dataIndex]),
    },
    grid: { left: 4, right: 44, top: 4, bottom: 4, containLabel: true },
    yAxis: {
      type: 'category',
      inverse: true,
      data: puestos.map((p) => nombrePareja(p.tipo, p.numero)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colores.bordeFuerte } },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 25,
      axisLabel: { formatter: '{value} %', color: colores.tintaTenue },
      splitLine: { lineStyle: { color: colores.borde } },
    },
    series: [
      {
        type: 'bar',
        name: 'Victorias',
        barMaxWidth: 28,
        data: puestos.map((p) => ({
          value: p.porcentajeVictorias ?? 0,
          itemStyle: {
            color: p.tipo === 'mixto' ? colores.mixto : colores.pistaOscuro,
            borderRadius: [0, 6, 6, 0],
          },
        })),
        label: {
          show: true,
          position: 'right',
          formatter: '{c} %',
          color: colores.tinta,
          fontWeight: 700,
        },
      },
    ],
  };
}

/** «Pareja 1 masculina: 2 de 3 ganados (1 WO en contra)». */
export function describirPuesto(puesto: BalancePuestoEquipo | undefined): string {
  if (!puesto) {
    return '';
  }
  const wo = [
    puesto.woAFavor ? `${puesto.woAFavor} WO a favor` : '',
    puesto.woEnContra ? `${puesto.woEnContra} WO en contra` : '',
  ].filter(Boolean);
  const detalle = wo.length ? ` (${wo.join(', ')})` : '';
  return `${nombrePareja(puesto.tipo, puesto.numero)}: ${puesto.ganados} de ${contarPartidos(puesto.partidos)} ganados${detalle}`;
}
