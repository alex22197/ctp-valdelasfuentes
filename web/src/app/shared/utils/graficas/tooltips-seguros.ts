import type { EChartsCoreOption } from 'echarts/core';

const ENTIDADES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

type Formateador = (...argumentos: unknown[]) => unknown;

/** Un texto listo para meterlo en HTML: sin etiquetas ni atributos que se interpreten. */
export function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter] ?? caracter);
}

/**
 * ECharts mete en HTML, sin escapar, lo que devuelve un `formatter` de la ayuda (tooltip) cuando
 * es una función, y ahí van nombres de jugadores y rivales. Se escapa su resultado: ninguna
 * ayuda de la web usa HTML a propósito. Las plantillas de texto («{c} %») ya las escapa ECharts.
 */
export function conTooltipsSeguros(opciones: EChartsCoreOption): EChartsCoreOption {
  const tooltip = opciones['tooltip'];
  if (!tooltip) {
    return opciones;
  }
  return {
    ...opciones,
    tooltip: Array.isArray(tooltip) ? tooltip.map(proteger) : proteger(tooltip),
  };
}

function proteger(tooltip: unknown): unknown {
  if (!tooltip || typeof tooltip !== 'object') {
    return tooltip;
  }
  const formatter = (tooltip as { formatter?: unknown }).formatter;
  if (typeof formatter !== 'function') {
    return tooltip;
  }
  const original = formatter as Formateador;
  return {
    ...tooltip,
    formatter: (...argumentos: unknown[]): string => escaparHtml(String(original(...argumentos))),
  };
}
