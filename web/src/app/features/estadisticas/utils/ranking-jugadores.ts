import type { EChartsCoreOption } from 'echarts/core';
import type { EstadisticaJugador } from '@data-access/estadisticas/interfaces/estadistica-jugador.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { ColoresGraficas } from '@shared/utils/graficas/interfaces/colores-graficas.interface';
import { contarPartidos, opcionesComunes } from '@shared/utils/graficas/opciones-comunes';
import type { OrdenRanking } from '../interfaces/orden-ranking.type';
import { OPACIDAD_ATENUADA, nombreEnEje } from './opciones-matriz';

/** Alto de cada barra del ranking: se toca con el dedo. */
export const ALTO_FILA_RANKING = 44;

/** Juegos ganados menos perdidos. */
export function diferenciaJuegos(jugador: EstadisticaJugador): number {
  return jugador.juegosGanados - jugador.juegosPerdidos;
}

/** El número que dibuja cada barra según el orden elegido. */
export function valorRanking(jugador: EstadisticaJugador, orden: OrdenRanking): number {
  switch (orden) {
    case 'partidos':
      return jugador.partidos;
    case 'victorias':
      return jugador.porcentajeVictorias ?? 0;
    case 'juegos':
      return diferenciaJuegos(jugador);
  }
}

/**
 * Chicos o chicas que han jugado algún partido, de mayor a menor según el orden elegido. A
 * igualdad, más partidos primero y después por nombre.
 */
export function ordenarRanking(
  jugadores: readonly EstadisticaJugador[],
  sexos: ReadonlyMap<string, Sexo>,
  sexo: Sexo,
  orden: OrdenRanking,
): EstadisticaJugador[] {
  return jugadores
    .filter((j) => j.partidos > 0 && sexos.get(j.id) === sexo)
    .sort(
      (a, b) =>
        valorRanking(b, orden) - valorRanking(a, orden) ||
        b.partidos - a.partidos ||
        a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'),
    );
}

/** Texto de la barra: «3», «67 %» o «+9». */
export function etiquetaRanking(jugador: EstadisticaJugador, orden: OrdenRanking): string {
  const valor = valorRanking(jugador, orden);
  if (orden === 'victorias') {
    return `${valor} %`;
  }
  return orden === 'juegos' && valor > 0 ? `+${valor}` : String(valor);
}

/** «Sergio: 3 partidos, 2 ganados (67 %), juegos 31-22». */
export function describirJugadorRanking(jugador: EstadisticaJugador | undefined): string {
  if (!jugador) {
    return '';
  }
  return `${jugador.nombreMostrar}: ${contarPartidos(jugador.partidos)}, ${jugador.ganados} ganados (${jugador.porcentajeVictorias ?? 0} %), juegos ${jugador.juegosGanados}-${jugador.juegosPerdidos}`;
}

/**
 * Las barras, con el jugador resaltado a plena opacidad y el resto atenuado (`null`: todos
 * normales). Se usa tanto al dibujar como al cambiar el resaltado.
 */
export function datosRanking(
  jugadores: readonly EstadisticaJugador[],
  orden: OrdenRanking,
  colores: ColoresGraficas,
  idResaltado: string | null,
): object[] {
  return jugadores.map((jugador) => {
    const valor = valorRanking(jugador, orden);
    const opacidad = idResaltado === null || idResaltado === jugador.id ? 1 : OPACIDAD_ATENUADA;
    return {
      value: valor,
      itemStyle: {
        color: valor < 0 ? colores.derrota : colores.pistaOscuro,
        borderRadius: valor < 0 ? [6, 0, 0, 6] : [0, 6, 6, 0],
        opacity: opacidad,
      },
      label: { opacity: opacidad },
    };
  });
}

/** Barras horizontales del ranking; el nombre de cada jugador también se puede tocar. */
export function opcionesRanking(
  jugadores: readonly EstadisticaJugador[],
  orden: OrdenRanking,
  colores: ColoresGraficas,
  animar: boolean,
): EChartsCoreOption {
  const comunes = opcionesComunes(colores, animar);
  return {
    ...comunes,
    tooltip: {
      ...(comunes['tooltip'] as object),
      formatter: ({ dataIndex }: { dataIndex: number }): string =>
        describirJugadorRanking(jugadores[dataIndex]),
    },
    grid: { left: 4, right: 40, top: 4, bottom: 4, containLabel: true },
    xAxis: {
      type: 'value',
      max: orden === 'victorias' ? 100 : undefined,
      minInterval: 1,
      axisLabel: { color: colores.tintaTenue },
      splitLine: { lineStyle: { color: colores.borde } },
    },
    yAxis: {
      type: 'category',
      inverse: true,
      triggerEvent: true,
      data: jugadores.map(nombreEnEje),
      axisTick: { show: false },
      axisLabel: { color: colores.tinta, fontWeight: 700 },
    },
    series: [
      {
        type: 'bar',
        barMaxWidth: 26,
        label: {
          show: true,
          position: 'right',
          color: colores.tinta,
          fontWeight: 700,
          formatter: ({ dataIndex }: { dataIndex: number }): string => {
            const jugador = jugadores[dataIndex];
            return jugador ? etiquetaRanking(jugador, orden) : '';
          },
        },
        data: datosRanking(jugadores, orden, colores, null),
      },
    ],
  };
}
