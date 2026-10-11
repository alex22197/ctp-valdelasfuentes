import type { EChartsCoreOption } from 'echarts/core';
import type { ColoresGraficas } from './interfaces/colores-graficas.interface';

const VARIABLES: Record<keyof ColoresGraficas, string> = {
  pista: '--color-pista',
  pistaOscuro: '--color-pista-oscuro',
  pistaSuave: '--color-pista-suave',
  mixto: '--color-mixto',
  derrota: '--color-derrota',
  tinta: '--color-tinta',
  tintaTenue: '--color-tinta-tenue',
  borde: '--color-borde',
  bordeFuerte: '--color-borde-fuerte',
  superficie: '--color-superficie',
  sobrePista: '--color-sobre-pista',
  fuente: '--fuente',
};

/**
 * Lee los tokens del sistema de diseño para dárselos a ECharts, que pinta en un canvas y no
 * entiende variables CSS. Así las gráficas nunca usan colores sueltos.
 */
export function leerColoresGraficas(
  estilos: Pick<CSSStyleDeclaration, 'getPropertyValue'>,
): ColoresGraficas {
  const entradas = Object.entries(VARIABLES).map(([clave, variable]) => [
    clave,
    estilos.getPropertyValue(variable).trim(),
  ]);
  return Object.fromEntries(entradas) as unknown as ColoresGraficas;
}

/**
 * Lo que comparten todas las gráficas: la fuente de la web, descripción para lectores de
 * pantalla, ayuda al tocar (no al pasar el ratón, que en el móvil no existe) y animación
 * solo si el usuario no ha pedido reducir el movimiento.
 */
export function opcionesComunes(colores: ColoresGraficas, animar: boolean): EChartsCoreOption {
  return {
    animation: animar,
    textStyle: { fontFamily: colores.fuente, color: colores.tinta },
    aria: { enabled: true },
    tooltip: { triggerOn: 'click', confine: true },
  };
}

/** «1 partido» o «3 partidos». */
export function contarPartidos(partidos: number): string {
  return `${partidos} ${partidos === 1 ? 'partido' : 'partidos'}`;
}
