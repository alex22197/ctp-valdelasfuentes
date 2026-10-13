import type { SetFormulario } from '../interfaces/set-formulario.interface';
import { errorAlEscribirSet } from './error-set-escrito';

const set = (
  juegosNuestros: string,
  juegosRival: string,
  tiebreakNuestros = '',
  tiebreakRival = '',
): SetFormulario => ({ juegosNuestros, juegosRival, tiebreakNuestros, tiebreakRival });

describe('errorAlEscribirSet', () => {
  it('no dice nada mientras falta algún juego por escribir', () => {
    expect(errorAlEscribirSet(set('', ''))).toBeNull();
    expect(errorAlEscribirSet(set('7', ''))).toBeNull();
  });

  it('avisa de unos juegos imposibles en cuanto se escriben', () => {
    expect(errorAlEscribirSet(set('8', ''))).toBe('Los juegos van de 0 a 7');
    expect(errorAlEscribirSet(set('', '-1'))).toBe('Los juegos van de 0 a 7');
    expect(errorAlEscribirSet(set('2.5', '6'))).toBe('Los juegos van de 0 a 7');
  });

  it('rechaza un 7-2 y cualquier 7 que no sea 7-5 o 7-6', () => {
    expect(errorAlEscribirSet(set('7', '2'))).toBe(
      '7-2 no es posible; a 7 juegos solo se llega con 7-5 o 7-6',
    );
    expect(errorAlEscribirSet(set('0', '7'))).toBe(
      '0-7 no es posible; a 7 juegos solo se llega con 7-5 o 7-6',
    );
  });

  it('acepta sets terminados y sets a medias, que «Guardar» juzga después', () => {
    expect(errorAlEscribirSet(set('6', '4'))).toBeNull();
    expect(errorAlEscribirSet(set('7', '5'))).toBeNull();
    expect(errorAlEscribirSet(set('7', '6'))).toBeNull();
    expect(errorAlEscribirSet(set('3', '2'))).toBeNull();
  });

  it('comprueba el tie-break solo cuando están sus dos puntos', () => {
    expect(errorAlEscribirSet(set('7', '6', '7', ''))).toBeNull();
    expect(errorAlEscribirSet(set('7', '6', '7', '5'))).toBeNull();
    expect(errorAlEscribirSet(set('7', '6', '7', '6'))).toBe(
      'El tie-break se gana a 7 puntos con 2 de diferencia',
    );
    expect(errorAlEscribirSet(set('7', '6', '3', '7'))).toBe(
      'El tie-break lo gana la pareja que gana el set',
    );
  });
});
