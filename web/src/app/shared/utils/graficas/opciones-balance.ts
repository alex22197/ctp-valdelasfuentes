import type { EChartsCoreOption } from 'echarts/core';
import type { ColoresGraficas } from './interfaces/colores-graficas.interface';
import type { FilaBalance } from './interfaces/fila-balance.interface';
import { opcionesComunes } from './opciones-comunes';

/** Alto que necesita la gráfica: una barra por fila más la leyenda. */
export function altoBalance(filas: readonly FilaBalance[]): number {
  return 40 + filas.length * 55;
}

/** Si alguna fila tiene algo que enseñar. */
export function hayBalance(filas: readonly FilaBalance[]): boolean {
  return filas.some((fila) => fila.ganados + fila.perdidos > 0);
}

/** «En casa: 3 ganados y 3 perdidos. Fuera: 1 ganado y 5 perdidos.», para lectores de pantalla. */
export function describirBalance(filas: readonly FilaBalance[]): string {
  return filas
    .map(
      (fila) =>
        `${fila.nombre}: ${fila.ganados} ${fila.ganados === 1 ? 'ganado' : 'ganados'} y ${fila.perdidos} ${fila.perdidos === 1 ? 'perdido' : 'perdidos'}.`,
    )
    .join(' ');
}

/**
 * Una barra por fila, repartida entre ganados (verde oscuro) y perdidos (rojo). Se dibuja
 * en proporción (unas filas pueden tener muchos más que otras) y cada parte lleva su número,
 * salvo si está vacía: su 0 quedaría cortado contra el borde.
 */
export function opcionesBalance(
  filas: readonly FilaBalance[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const parte = (fila: FilaBalance, valor: number): number => {
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
      formatter: ({ dataIndex }: { dataIndex: number }): string => {
        const valor = filas[dataIndex]?.[clave] ?? 0;
        return valor > 0 ? String(valor) : '';
      },
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
      data: filas.map((fila) => fila.nombre),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    series: [
      serie('Ganados', 'ganados', colores.pistaOscuro, colores.sobrePista),
      serie('Perdidos', 'perdidos', colores.derrota, colores.sobrePista),
    ],
  };
}
