import { notaResultado, textoPareja, textoSet } from './textos-partido';

describe('textoPareja', () => {
  const pablo = { id: 'a', nombreMostrar: 'Pablo' };
  const ivan = { id: 'b', nombreMostrar: 'Iván' };

  it('revés y drive, en ese orden', () => {
    expect(textoPareja(pablo, ivan)).toBe('Pablo y Iván');
  });

  it('un solo nombre si falta el otro, y nada si no hay nadie', () => {
    expect(textoPareja(null, ivan)).toBe('Iván');
    expect(textoPareja(null, null)).toBeNull();
  });
});

describe('textoSet', () => {
  it('nuestros juegos primero', () => {
    expect(
      textoSet({ juegosNuestros: 4, juegosRival: 6, tiebreakNuestros: null, tiebreakRival: null }),
    ).toBe('4-6');
  });
});

describe('notaResultado', () => {
  it('aclara los WO, los abandonos y los suspendidos', () => {
    expect(notaResultado('wo_favor')).toBe('WO');
    expect(notaResultado('wo_contra')).toBe('WO');
    expect(notaResultado('abandono')).toBe('Abandono');
    expect(notaResultado('suspendido')).toBe('Suspendido');
  });

  it('nada en un partido normal o por jugar', () => {
    expect(notaResultado('normal')).toBeNull();
    expect(notaResultado(null)).toBeNull();
  });
});
