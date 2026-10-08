import type { SetFormulario } from '../interfaces/set-formulario.interface';
import {
  construirMarcador,
  describirPareja,
  marcadoresIguales,
  setsFormularioDesde,
} from './formulario-resultado';

function fila(
  juegosNuestros: string,
  juegosRival: string,
  tiebreakNuestros = '',
  tiebreakRival = '',
): SetFormulario {
  return { juegosNuestros, juegosRival, tiebreakNuestros, tiebreakRival };
}

const vacia = fila('', '');

describe('construirMarcador', () => {
  it('ignora las filas vacías del final', () => {
    const marcador = construirMarcador('normal', null, [fila('6', '4'), fila('6', '3'), vacia]);
    expect(marcador.sets).toEqual([
      { juegosNuestros: 6, juegosRival: 4, tiebreakNuestros: null, tiebreakRival: null },
      { juegosNuestros: 6, juegosRival: 3, tiebreakNuestros: null, tiebreakRival: null },
    ]);
  });

  it('conserva una fila vacía entre dos rellenas para que la validación la señale', () => {
    const marcador = construirMarcador('normal', null, [fila('6', '4'), vacia, fila('6', '3')]);
    expect(marcador.sets).toHaveLength(3);
    expect(Number.isNaN(marcador.sets[1]?.juegosNuestros)).toBe(true);
  });

  it('solo tiene en cuenta el tie-break si el set acaba 7-6', () => {
    const marcador = construirMarcador('normal', null, [
      fila('7', '6', '7', '3'),
      fila('6', '4', '7', '3'),
    ]);
    expect(marcador.sets[0]?.tiebreakNuestros).toBe(7);
    expect(marcador.sets[1]?.tiebreakNuestros).toBeNull();
  });

  it('no envía sets en un WO ni el ganador fuera de un abandono', () => {
    expect(construirMarcador('wo_favor', true, [fila('6', '0'), vacia, vacia])).toEqual({
      resultado: 'wo_favor',
      ganado: null,
      sets: [],
    });
    expect(construirMarcador('abandono', false, [fila('2', '1'), vacia, vacia]).ganado).toBe(false);
  });
});

describe('setsFormularioDesde', () => {
  it('siempre da tres filas', () => {
    const filas = setsFormularioDesde([
      { juegosNuestros: 7, juegosRival: 6, tiebreakNuestros: 7, tiebreakRival: 5 },
    ]);
    expect(filas).toEqual([fila('7', '6', '7', '5'), vacia, vacia]);
  });
});

describe('marcadoresIguales', () => {
  it('compara por contenido', () => {
    const sets = [
      { juegosNuestros: 6, juegosRival: 4, tiebreakNuestros: null, tiebreakRival: null },
    ];
    expect(
      marcadoresIguales(
        { resultado: 'normal', ganado: null, sets },
        { resultado: 'normal', ganado: null, sets: [...sets] },
      ),
    ).toBe(true);
    expect(
      marcadoresIguales(
        { resultado: 'normal', ganado: null, sets },
        { resultado: 'abandono', ganado: true, sets },
      ),
    ).toBe(false);
  });
});

describe('describirPareja', () => {
  it('nombra a la pareja aunque esté incompleta', () => {
    const sergio = { id: 's', nombreMostrar: 'Sergio' };
    const jorge = { id: 'j', nombreMostrar: 'Jorge' };
    expect(describirPareja(sergio, jorge)).toBe('Sergio y Jorge');
    expect(describirPareja(null, jorge)).toBe('Jorge y pareja sin asignar');
    expect(describirPareja(null, null)).toBe('Pareja sin asignar');
  });
});
