import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import type { JugadorResaltado } from '../interfaces/jugador-resaltado.interface';
import type { MatrizParejas } from '../interfaces/matriz-parejas.interface';

/** El nombre de un eje sin el asterisco que marca a los comodines. */
function sinAsterisco(etiqueta: string): string {
  return etiqueta.replace(/\*$/, '');
}

function porNombre(
  jugadores: readonly JugadorResaltado[],
  etiqueta: string | null,
): JugadorResaltado | null {
  return etiqueta === null
    ? null
    : (jugadores.find((j) => j.nombreMostrar === sinAsterisco(etiqueta)) ?? null);
}

/**
 * Jugador tocado en una gráfica con un jugador por fila (ranking, revés contra drive): su
 * barra o su nombre en el eje.
 */
export function jugadorDeLista(
  jugadores: readonly JugadorResaltado[],
  toque: ToqueGrafica,
): JugadorResaltado | null {
  if (toque.indice !== null) {
    return jugadores[toque.indice] ?? null;
  }
  return porNombre(jugadores, toque.etiqueta);
}

/**
 * Jugador tocado en la matriz «quién con quién». Una casilla es una pareja: se resalta al
 * jugador de su fila, y la ayuda dice quién es el compañero. Un nombre de cualquiera de los
 * dos ejes resalta a ese jugador.
 */
export function jugadorDeMatriz(
  matriz: MatrizParejas,
  toque: ToqueGrafica,
): JugadorResaltado | null {
  if (toque.indice !== null) {
    const celda = matriz.celdas[toque.indice];
    return (celda && matriz.filas[celda.fila]) ?? null;
  }
  const eje = toque.componente === 'xAxis' ? matriz.columnas : matriz.filas;
  return porNombre(eje, toque.etiqueta);
}
