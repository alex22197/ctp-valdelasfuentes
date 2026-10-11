import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { construirMatriz } from './matriz-parejas';

const jugador = (id: string, nombreMostrar: string, comodin = false) => ({
  id,
  nombreMostrar,
  comodin,
});

const pareja = (
  tipo: BalancePareja['tipo'],
  a: ReturnType<typeof jugador>,
  b: ReturnType<typeof jugador>,
  partidos: number,
  porcentajeVictorias: number,
): BalancePareja => ({
  tipo,
  jugadorA: a,
  jugadorB: b,
  partidos,
  ganados: 0,
  perdidos: 0,
  porcentajeVictorias,
});

const sergio = jugador('s', 'Sergio');
const jorge = jugador('j', 'Jorge');
const alex = jugador('a', 'Alex');
const rocio = jugador('r', 'Rocio');
const sexos = new Map<string, Sexo>([
  ['s', 'masculino'],
  ['j', 'masculino'],
  ['a', 'masculino'],
  ['r', 'femenino'],
]);

describe('construirMatriz', () => {
  it('en masculino pone a todos en filas y columnas y la pareja en las dos mitades', () => {
    const matriz = construirMatriz(
      [pareja('masculino', sergio, jorge, 3, 67), pareja('masculino', alex, sergio, 1, 0)],
      'masculino',
      sexos,
    );
    expect(matriz.filas.map((j) => j.nombreMostrar)).toEqual(['Alex', 'Jorge', 'Sergio']);
    expect(matriz.columnas).toBe(matriz.filas);
    expect(matriz.celdas).toContainEqual({
      fila: 2,
      columna: 1,
      partidos: 3,
      porcentajeVictorias: 67,
    });
    expect(matriz.celdas).toContainEqual({
      fila: 1,
      columna: 2,
      partidos: 3,
      porcentajeVictorias: 67,
    });
    expect(matriz.celdas).toHaveLength(4);
  });

  it('en el mixto pone a los chicos en filas y a las chicas en columnas', () => {
    const matriz = construirMatriz([pareja('mixto', rocio, alex, 2, 50)], 'mixto', sexos);
    expect(matriz.filas.map((j) => j.nombreMostrar)).toEqual(['Alex']);
    expect(matriz.columnas.map((j) => j.nombreMostrar)).toEqual(['Rocio']);
    expect(matriz.celdas).toEqual([{ fila: 0, columna: 0, partidos: 2, porcentajeVictorias: 50 }]);
  });

  it('ignora las parejas de otros tipos y queda vacía si no hay ninguna', () => {
    expect(construirMatriz([pareja('masculino', sergio, jorge, 1, 0)], 'femenino', sexos)).toEqual({
      filas: [],
      columnas: [],
      celdas: [],
    });
  });
});
