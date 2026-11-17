import type { ConfrontacionLeida } from './interfaces/confrontacion-leida.interface.ts';
import { limpiarNombreEquipo } from './nombres-equipo.ts';

/**
 * Lectura de las tablas de la web de la liga, que son HTML sencillo y regular: filas `<tr>`
 * con celdas `<td>`. Lo comparten la página de grupo y la de eliminatorias.
 */

const FILA = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
const CELDA = /<td[^>]*>([\s\S]*?)<\/td>/gi;

/** Las filas de una tabla como listas de textos, ya sin etiquetas ni entidades. */
export function filasDeTabla(tablaHtml: string): string[][] {
  return [...tablaHtml.matchAll(FILA)].map((fila) =>
    [...(fila[1] ?? '').matchAll(CELDA)].map((celda) => textoDeCelda(celda[1] ?? '')),
  );
}

/** Una fila «marcador, local, VS, visitante, marcador», como las de jornadas y eliminatorias. */
export function leerConfrontacion(celdas: readonly string[], donde: string): ConfrontacionLeida {
  const [marcadorLocal, local, vs, visitante, marcadorVisitante] = celdas;
  if (celdas.length !== 5 || vs?.toUpperCase() !== 'VS' || !local || !visitante) {
    throw new Error(`${donde}: se esperaba «marcador, local, VS, visitante, marcador»`);
  }
  return {
    local: limpiarNombreEquipo(local),
    visitante: limpiarNombreEquipo(visitante),
    partidosLocal: leerNumero(marcadorLocal, `${donde}, marcador local`),
    partidosVisitante: leerNumero(marcadorVisitante, `${donde}, marcador visitante`),
  };
}

export function leerNumero(texto: string | undefined, donde: string): number {
  if (texto === undefined || !/^-?\d+$/.test(texto)) {
    throw new Error(`${donde}: «${texto ?? ''}» no es un número`);
  }
  return Number(texto);
}

function textoDeCelda(html: string): string {
  return decodificarEntidades(html.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

const ENTIDADES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

function decodificarEntidades(texto: string): string {
  return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (todo, codigo: string) => {
    if (codigo.startsWith('#x') || codigo.startsWith('#X')) {
      return String.fromCodePoint(Number.parseInt(codigo.slice(2), 16));
    }
    if (codigo.startsWith('#')) {
      return String.fromCodePoint(Number(codigo.slice(1)));
    }
    return ENTIDADES[codigo.toLowerCase()] ?? todo;
  });
}
