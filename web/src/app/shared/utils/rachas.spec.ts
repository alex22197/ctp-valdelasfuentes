import { calcularRacha, describirRacha } from './rachas';

describe('calcularRacha', () => {
  it('cuenta los últimos resultados iguales', () => {
    expect(calcularRacha([false, true, true, true])).toEqual({ tipo: 'victorias', largo: 3 });
    expect(calcularRacha([true, false, false])).toEqual({ tipo: 'derrotas', largo: 2 });
    expect(calcularRacha([true])).toEqual({ tipo: 'victorias', largo: 1 });
  });

  it('sin partidos, nada', () => {
    expect(calcularRacha([])).toBeNull();
  });
});

describe('describirRacha', () => {
  it('lo dice en castellano', () => {
    expect(describirRacha({ tipo: 'victorias', largo: 3 })).toBe('3 victorias seguidas');
    expect(describirRacha({ tipo: 'derrotas', largo: 2 })).toBe('2 derrotas seguidas');
    expect(describirRacha({ tipo: 'victorias', largo: 1 })).toBe('Última: victoria');
    expect(describirRacha({ tipo: 'derrotas', largo: 1 })).toBe('Última: derrota');
    expect(describirRacha(null)).toBe('Sin partidos');
  });
});
