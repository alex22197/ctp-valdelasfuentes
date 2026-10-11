import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import type { MatrizParejas } from '../interfaces/matriz-parejas.interface';
import { jugadorDeLista, jugadorDeMatriz } from './jugador-tocado';

const alex = { id: 'a', nombreMostrar: 'Alex', comodin: false };
const jess = { id: 'j', nombreMostrar: 'Jess', comodin: true };
const rocio = { id: 'r', nombreMostrar: 'Rocio', comodin: false };

const dato = (indice: number): ToqueGrafica => ({
  componente: 'series',
  indice,
  indiceSerie: 0,
  etiqueta: null,
});
const etiqueta = (componente: string, texto: string): ToqueGrafica => ({
  componente,
  indice: null,
  indiceSerie: null,
  etiqueta: texto,
});

describe('jugadorDeLista', () => {
  it('toma el jugador de la barra o del nombre tocado, aunque lleve asterisco', () => {
    expect(jugadorDeLista([alex, jess], dato(1))).toBe(jess);
    expect(jugadorDeLista([alex, jess], etiqueta('yAxis', 'Jess*'))).toBe(jess);
    expect(jugadorDeLista([alex], dato(5))).toBeNull();
    expect(jugadorDeLista([alex], etiqueta('yAxis', 'Nadie'))).toBeNull();
  });
});

describe('jugadorDeMatriz', () => {
  const matriz: MatrizParejas = {
    filas: [alex],
    columnas: [rocio, jess],
    celdas: [{ fila: 0, columna: 1, partidos: 1, porcentajeVictorias: 0 }],
  };

  it('una casilla resalta al jugador de su fila', () => {
    expect(jugadorDeMatriz(matriz, dato(0))).toBe(alex);
  });

  it('un nombre resalta a ese jugador, sea del eje de filas o del de columnas', () => {
    expect(jugadorDeMatriz(matriz, etiqueta('xAxis', 'Rocio'))).toBe(rocio);
    expect(jugadorDeMatriz(matriz, etiqueta('yAxis', 'Alex'))).toBe(alex);
    expect(jugadorDeMatriz(matriz, etiqueta('yAxis', 'Rocio'))).toBeNull();
  });
});
