import type { EChartsCoreOption } from 'echarts/core';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import type { EstadoForma } from '../interfaces/estado-forma.type';
import type { MapaForma } from '../interfaces/mapa-forma.interface';
import { OPACIDAD_ATENUADA, nombreEnEje } from './opciones-matriz';

/** Alto de cada fila del mapa en píxeles: se toca con el dedo. */
export const ALTO_FILA_FORMA = 40;
/** Ancho de cada columna (jornada). */
export const ANCHO_COLUMNA_FORMA = 48;

/** Cada estado va como un número en la casilla, que el mapa de colores traduce. */
const CODIGO: Record<EstadoForma, number> = { 'no-jugo': 0, perdido: 1, ganado: 2, wo: 3 };
const SIMBOLO: Record<EstadoForma, string> = { 'no-jugo': '', perdido: '✕', ganado: '✓', wo: 'WO' };
const ESTADOS = Object.keys(CODIGO) as EstadoForma[];

/**
 * Mapa de forma: una casilla por jugador y jornada, verde oscuro si ganó (✓), naranja si
 * perdió (✕), verde si ganó por WO y gris claro si no jugó. Se lee también sin color.
 */
export function opcionesMapaForma(
  mapa: MapaForma,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const comunes = opcionesComunes(colores, animar);
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        mapa.celdas[dataIndex]?.detalle ?? '',
    },
    grid: { left: 4, right: 4, top: 4, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      position: 'top',
      data: mapa.jornadas.map((j) => j.etiqueta),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { interval: 0, color: colores.tintaTenue, fontWeight: 700 },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      triggerEvent: true,
      data: mapa.jugadores.map(nombreEnEje),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { interval: 0, color: colores.tinta },
    },
    visualMap: {
      show: false,
      type: 'piecewise',
      dimension: 2,
      pieces: [
        { value: CODIGO['no-jugo'], color: colores.borde },
        { value: CODIGO.perdido, color: colores.derrota },
        { value: CODIGO.ganado, color: colores.pistaOscuro },
        { value: CODIGO.wo, color: colores.pista },
      ],
    },
    series: [
      {
        type: 'heatmap',
        data: datosMapaForma(mapa, colores, null),
        label: {
          show: true,
          fontWeight: 800,
          formatter: ({ value }: { value: number[] }): string =>
            SIMBOLO[ESTADOS[value[2] ?? 0] ?? 'no-jugo'],
        },
        itemStyle: { borderColor: colores.superficie, borderWidth: 3, borderRadius: 8 },
      },
    ],
  };
}

/**
 * Casillas del mapa. Con un jugador resaltado, solo su fila queda a plena opacidad. Se usan al
 * dibujar y al cambiar el resaltado.
 */
export function datosMapaForma(
  mapa: MapaForma,
  colores: ColoresGraficas,
  idResaltado: string | null,
): object[] {
  return mapa.celdas.map((celda) => {
    const suya = idResaltado === null || mapa.jugadores[celda.fila]?.id === idResaltado;
    const opacidad = suya ? 1 : OPACIDAD_ATENUADA;
    return {
      value: [celda.columna, celda.fila, CODIGO[celda.estado]],
      itemStyle: { opacity: opacidad },
      label: { opacity: opacidad, color: colores.sobrePista },
    };
  });
}
