import type { EChartsCoreOption } from 'echarts/core';
import type { BalancePuestoEquipo } from '@data-access/estadisticas/interfaces/balance-puesto-equipo.interface';
import { codigoPista, nombrePista } from '@shared/utils/etiquetas-partido';
import type { ColoresGraficas } from '../interfaces/colores-graficas.interface';
import { contarPartidos, opcionesComunes } from './opciones-comunes';

/** Barras con el porcentaje de victorias del equipo en cada puesto (M1, M2… y mixto en lima). */
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
    grid: { left: 4, right: 4, top: 28, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      data: puestos.map((p) => codigoPista(p.tipo, p.numero)),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: colores.bordeFuerte } },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    yAxis: {
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
        barMaxWidth: 44,
        data: puestos.map((p) => ({
          value: p.porcentajeVictorias ?? 0,
          itemStyle: {
            color: p.tipo === 'mixto' ? colores.mixto : colores.pistaOscuro,
            borderRadius: [6, 6, 0, 0],
          },
        })),
        label: {
          show: true,
          position: 'top',
          formatter: '{c} %',
          color: colores.tinta,
          fontWeight: 700,
        },
      },
    ],
  };
}

/** «Masculino 1: 2 de 3 ganados (1 WO en contra)». */
export function describirPuesto(puesto: BalancePuestoEquipo | undefined): string {
  if (!puesto) {
    return '';
  }
  const wo = [
    puesto.woAFavor ? `${puesto.woAFavor} WO a favor` : '',
    puesto.woEnContra ? `${puesto.woEnContra} WO en contra` : '',
  ].filter(Boolean);
  const detalle = wo.length ? ` (${wo.join(', ')})` : '';
  return `${nombrePista(puesto.tipo, puesto.numero)}: ${puesto.ganados} de ${contarPartidos(puesto.partidos)} ganados${detalle}`;
}
