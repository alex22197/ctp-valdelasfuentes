import type { EstadisticaJugador } from '@data-access/estadisticas/interfaces/estadistica-jugador.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { leerColoresGraficas } from '@shared/utils/graficas/opciones-comunes';
import { OPACIDAD_ATENUADA } from './opciones-matriz';
import {
  datosRanking,
  describirJugadorRanking,
  etiquetaRanking,
  ordenarRanking,
} from './ranking-jugadores';

const COLORES = leerColoresGraficas({ getPropertyValue: (variable: string) => variable });

const jugador = (
  id: string,
  nombreMostrar: string,
  partidos: number,
  porcentajeVictorias: number | null,
  juegosGanados: number,
  juegosPerdidos: number,
): EstadisticaJugador => ({
  id,
  nombreMostrar,
  comodin: false,
  partidos,
  ganados: 0,
  perdidos: 0,
  porcentajeVictorias,
  setsGanados: 0,
  setsPerdidos: 0,
  juegosGanados,
  juegosPerdidos,
  jornadas: partidos,
  woAFavor: 0,
});

const sergio = jugador('s', 'Sergio', 3, 67, 31, 22);
const alex = jugador('a', 'Alex', 1, 100, 16, 14);
const diego = jugador('d', 'Diego', 0, null, 0, 0);
const rocio = jugador('r', 'Rocio', 2, 0, 5, 12);
const sexos = new Map<string, Sexo>([
  ['s', 'masculino'],
  ['a', 'masculino'],
  ['d', 'masculino'],
  ['r', 'femenino'],
]);
const todos = [sergio, alex, diego, rocio];

describe('ordenarRanking', () => {
  it('filtra por sexo, quita a quien no ha jugado y ordena según lo elegido', () => {
    const nombres = (orden: Parameters<typeof ordenarRanking>[3]): string[] =>
      ordenarRanking(todos, sexos, 'masculino', orden).map((j) => j.nombreMostrar);
    expect(nombres('partidos')).toEqual(['Sergio', 'Alex']);
    expect(nombres('victorias')).toEqual(['Alex', 'Sergio']);
    expect(nombres('juegos')).toEqual(['Sergio', 'Alex']);
    expect(ordenarRanking(todos, sexos, 'femenino', 'partidos')).toEqual([rocio]);
  });
});

describe('etiquetaRanking y describirJugadorRanking', () => {
  it('escribe la cifra con su unidad y el signo de los juegos', () => {
    expect(etiquetaRanking(sergio, 'partidos')).toBe('3');
    expect(etiquetaRanking(sergio, 'victorias')).toBe('67 %');
    expect(etiquetaRanking(sergio, 'juegos')).toBe('+9');
    expect(etiquetaRanking(rocio, 'juegos')).toBe('-7');
    expect(describirJugadorRanking(sergio)).toBe(
      'Sergio: 3 partidos, 0 ganados (67 %), juegos 31-22',
    );
  });
});

describe('datosRanking', () => {
  it('atenúa a todos menos al resaltado y pinta en naranja los juegos en contra', () => {
    const datos = datosRanking([sergio, rocio], 'juegos', COLORES, 's') as {
      value: number;
      itemStyle: { color: string; opacity: number };
    }[];
    expect(datos.map((d) => d.itemStyle.opacity)).toEqual([1, OPACIDAD_ATENUADA]);
    expect(datos[1]?.itemStyle.color).toBe('--color-derrota');
    expect(datos[1]?.value).toBe(-7);
  });
});
