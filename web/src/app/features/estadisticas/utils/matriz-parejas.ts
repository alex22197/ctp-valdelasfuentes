import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { CeldaMatriz } from '../interfaces/celda-matriz.interface';
import type { MatrizParejas } from '../interfaces/matriz-parejas.interface';

/**
 * Matriz de parejas de un tipo de partido, con los jugadores por orden alfabético.
 *
 * - Masculino y femenino: los mismos jugadores en filas y columnas, y cada pareja en las dos
 *   mitades, para que la fila de cada jugador muestre a todos sus compañeros.
 * - Mixto: chicos en las filas y chicas en las columnas. La vista guarda la pareja sin orden,
 *   así que el sexo sale de la plantilla; si no se conoce, se toma el orden de la vista.
 */
export function construirMatriz(
  parejas: readonly BalancePareja[],
  tipo: TipoPartido,
  sexos: ReadonlyMap<string, Sexo>,
): MatrizParejas {
  const delTipo = parejas.filter((p) => p.tipo === tipo).map((p) => orientar(p, tipo, sexos));
  const filas = unicos(delTipo.flatMap(([a, b]) => (tipo === 'mixto' ? [a] : [a, b])));
  const columnas = tipo === 'mixto' ? unicos(delTipo.map(([, b]) => b)) : filas;
  const posicion = (lista: readonly JugadorPareja[], id: string): number =>
    lista.findIndex((j) => j.id === id);

  const celdas = delTipo.flatMap(([a, b, pareja]): CeldaMatriz[] => {
    const celda = (fila: JugadorPareja, columna: JugadorPareja): CeldaMatriz => ({
      fila: posicion(filas, fila.id),
      columna: posicion(columnas, columna.id),
      partidos: pareja.partidos,
      porcentajeVictorias: pareja.porcentajeVictorias,
    });
    return tipo === 'mixto' ? [celda(a, b)] : [celda(a, b), celda(b, a)];
  });

  return { filas, columnas, celdas };
}

/** En el mixto, el chico primero. */
function orientar(
  pareja: BalancePareja,
  tipo: TipoPartido,
  sexos: ReadonlyMap<string, Sexo>,
): [JugadorPareja, JugadorPareja, BalancePareja] {
  const { jugadorA: a, jugadorB: b } = pareja;
  const alReves = tipo === 'mixto' && sexos.get(a.id) === 'femenino';
  return alReves ? [b, a, pareja] : [a, b, pareja];
}

function unicos(jugadores: readonly JugadorPareja[]): JugadorPareja[] {
  const porId = new Map(jugadores.map((j) => [j.id, j]));
  return [...porId.values()].sort((x, y) => x.nombreMostrar.localeCompare(y.nombreMostrar, 'es'));
}
