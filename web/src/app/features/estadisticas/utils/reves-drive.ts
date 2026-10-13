import type { EChartsCoreOption } from 'echarts/core';
import type { LadosJugador } from '@data-access/estadisticas/interfaces/lados-jugador.interface';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { contarPartidos, opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import { OPACIDAD_ATENUADA, nombreEnEje } from './opciones-matriz';

/** Jugadores con más partidos primero; a igualdad, por nombre. */
export function ordenarLados(lados: readonly LadosJugador[]): LadosJugador[] {
  const total = (l: LadosJugador): number => l.reves.partidos + l.drive.partidos;
  return [...lados].sort(
    (a, b) => total(b) - total(a) || a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'),
  );
}

/** «Sergio: de revés, 3 partidos (67 %); de drive, 1 partido (0 %)». */
export function describirLados(jugador: LadosJugador | undefined): string {
  if (!jugador) {
    return '';
  }
  const lado = (nombre: string, balance: LadosJugador['reves']): string =>
    balance.partidos
      ? `de ${nombre}, ${contarPartidos(balance.partidos)} (${balance.porcentajeVictorias ?? 0} %)`
      : `de ${nombre}, ninguno`;
  return `${jugador.nombreMostrar}: ${lado('revés', jugador.reves)}; ${lado('drive', jugador.drive)}`;
}

/** Valor sin signo: el revés se dibuja hacia la izquierda, pero se lee en positivo. */
function sinSigno({ value }: { value: number }): string {
  return value ? String(Math.abs(value)) : '';
}

/**
 * Datos de las dos series (revés en negativo, a la izquierda; drive a la derecha), con el
 * jugador resaltado a plena opacidad. Se usan al dibujar y al cambiar el resaltado.
 */
export function datosLados(
  lados: readonly LadosJugador[],
  idResaltado: string | null,
): { reves: object[]; drive: object[] } {
  const dato = (jugador: LadosJugador, valor: number): object => {
    const opacidad = idResaltado === null || idResaltado === jugador.id ? 1 : OPACIDAD_ATENUADA;
    return { value: valor, itemStyle: { opacity: opacidad }, label: { opacity: opacidad } };
  };
  return {
    reves: lados.map((l) => dato(l, -l.reves.partidos)),
    drive: lados.map((l) => dato(l, l.drive.partidos)),
  };
}

/** Barras en mariposa: partidos de revés a la izquierda y de drive a la derecha. */
export function opcionesLados(
  lados: readonly LadosJugador[],
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const datos = datosLados(lados, null);
  const serie = (nombre: string, color: string, data: object[], posicion: string): object => ({
    type: 'bar',
    name: nombre,
    stack: 'lados',
    barMaxWidth: 26,
    itemStyle: { color },
    label: {
      show: true,
      position: posicion,
      color: colores.sobrePista,
      fontWeight: 700,
      formatter: sinSigno,
    },
    data,
  });
  const comunes = opcionesComunes(colores, animar);
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string => describirLados(lados[dataIndex]),
    },
    legend: { top: 0, left: 0, itemWidth: 14, itemHeight: 14, textStyle: { color: colores.tinta } },
    grid: { left: 4, right: 24, top: 36, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        color: colores.tintaTenue,
        formatter: (valor: number): string => String(Math.abs(valor)),
      },
      splitLine: { lineStyle: { color: colores.borde } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      triggerEvent: true,
      data: lados.map(nombreEnEje),
      axisTick: { show: false },
      axisLine: { onZero: false },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    series: [
      serie('Revés', colores.pista, datos.reves, 'insideLeft'),
      serie('Drive', colores.pistaOscuro, datos.drive, 'insideRight'),
    ],
  };
}
