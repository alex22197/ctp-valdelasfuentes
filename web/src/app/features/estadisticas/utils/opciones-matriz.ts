import type { EChartsCoreOption } from 'echarts/core';
import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import type { MatrizParejas } from '../interfaces/matriz-parejas.interface';
import { contarPartidos, opcionesComunes } from '@shared/utils/graficas/opciones-comunes';

/** Opacidad de lo que no está resaltado en las gráficas de jugadores. */
export const OPACIDAD_ATENUADA = 0.25;

/** Alto de cada fila de la matriz en píxeles: deja tocar cada casilla con el dedo. */
export const ALTO_FILA_MATRIZ = 44;

/** El asterisco marca a los comodines, como explica la leyenda de la página. */
export function nombreEnEje(jugador: JugadorPareja): string {
  return jugador.comodin ? `${jugador.nombreMostrar}*` : jugador.nombreMostrar;
}

/**
 * Matriz «quién con quién»: cada casilla dice cuántos partidos ha jugado la pareja y su color,
 * de claro a oscuro, el porcentaje de victorias. El número se escribe en blanco sobre las
 * casillas oscuras para que se lea.
 */
export function opcionesMatriz(
  matriz: MatrizParejas,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const comunes = opcionesComunes(colores, animar);
  // Con muchas columnas los nombres van girados y el último se sale por la derecha:
  // containLabel no cuenta el giro, así que se le deja sitio.
  const girar = matriz.columnas.length > 4;
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        describirCelda(matriz, dataIndex),
    },
    grid: { left: 4, right: girar ? 40 : 4, top: 4, bottom: 4, containLabel: true },
    xAxis: {
      type: 'category',
      position: 'top',
      triggerEvent: true,
      data: matriz.columnas.map(nombreEnEje),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { interval: 0, rotate: girar ? 45 : 0, color: colores.tinta },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      triggerEvent: true,
      data: matriz.filas.map(nombreEnEje),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: { interval: 0, color: colores.tinta },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 100,
      dimension: 2,
      inRange: { color: [colores.pistaSuave, colores.pista, colores.pistaOscuro] },
    },
    series: [
      {
        type: 'heatmap',
        data: datosMatriz(matriz, colores, null),
        label: {
          show: true,
          fontWeight: 700,
          formatter: ({ value }: { value: number[] }): string => String(value[3]),
        },
        itemStyle: { borderColor: colores.superficie, borderWidth: 2, borderRadius: 6 },
      },
    ],
  };
}

/**
 * Casillas de la matriz. Con un jugador resaltado, solo sus parejas (su fila o su columna)
 * quedan a plena opacidad. Se usan al dibujar y al cambiar el resaltado.
 */
export function datosMatriz(
  matriz: MatrizParejas,
  colores: ColoresGraficas,
  idResaltado: string | null,
): object[] {
  return matriz.celdas.map((celda) => {
    const suya =
      idResaltado === null ||
      matriz.filas[celda.fila]?.id === idResaltado ||
      matriz.columnas[celda.columna]?.id === idResaltado;
    const opacidad = suya ? 1 : OPACIDAD_ATENUADA;
    return {
      value: [celda.columna, celda.fila, celda.porcentajeVictorias ?? 0, celda.partidos],
      itemStyle: { opacity: opacidad },
      label: {
        opacity: opacidad,
        color: (celda.porcentajeVictorias ?? 0) >= 50 ? colores.sobrePista : colores.tinta,
      },
    };
  });
}

/** «Sergio y Jorge: 3 partidos, 67 % ganados». */
export function describirCelda(matriz: MatrizParejas, indice: number): string {
  const celda = matriz.celdas[indice];
  const fila = celda && matriz.filas[celda.fila];
  const columna = celda && matriz.columnas[celda.columna];
  if (!celda || !fila || !columna) {
    return '';
  }
  return `${fila.nombreMostrar} y ${columna.nombreMostrar}: ${contarPartidos(celda.partidos)}, ${celda.porcentajeVictorias ?? 0} % ganados`;
}
