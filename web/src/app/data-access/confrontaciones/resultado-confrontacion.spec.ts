import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import { balanceDe, describirBalance, resultadoDe } from './resultado-confrontacion';

const con = (nuestros: number, rival: number): ConfrontacionNuestroEquipo =>
  ({ marcador: { nuestros, rival } }) as ConfrontacionNuestroEquipo;
const sinMarcador = { marcador: null } as ConfrontacionNuestroEquipo;

describe('resultadoDe', () => {
  it('compara los partidos de cada lado', () => {
    expect(resultadoDe({ nuestros: 4, rival: 2 })).toBe('victoria');
    expect(resultadoDe({ nuestros: 3, rival: 3 })).toBe('empate');
    expect(resultadoDe({ nuestros: 1, rival: 5 })).toBe('derrota');
  });
});

describe('balanceDe', () => {
  it('cuenta solo las que tienen marcador', () => {
    expect(balanceDe([con(4, 2), con(3, 3), con(0, 6), con(2, 4), sinMarcador])).toEqual({
      victorias: 1,
      empates: 1,
      derrotas: 2,
    });
  });
});

describe('describirBalance', () => {
  it('dice solo lo que hay, en singular o plural', () => {
    expect(describirBalance({ victorias: 1, empates: 0, derrotas: 2 })).toBe(
      '1 victoria, 2 derrotas',
    );
    expect(describirBalance({ victorias: 2, empates: 1, derrotas: 1 })).toBe(
      '2 victorias, 1 empate, 1 derrota',
    );
  });

  it('sin resultados no dice nada', () => {
    expect(describirBalance({ victorias: 0, empates: 0, derrotas: 0 })).toBeNull();
  });
});
