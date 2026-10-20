import {
  clavePartido,
  codigoPista,
  etiquetaPartido,
  nombrePareja,
  nombrePista,
} from './etiquetas-partido';

describe('etiquetaPartido', () => {
  it('incluye el número de pareja en masculino y femenino', () => {
    expect(etiquetaPartido('masculino', 2)).toBe('Masculino, pareja 2');
    expect(etiquetaPartido('femenino', 1)).toBe('Femenino, pareja 1');
  });

  it('no numera el mixto porque solo hay uno', () => {
    expect(etiquetaPartido('mixto', 1)).toBe('Mixto');
  });
});

describe('nombrePareja', () => {
  it('dice el número y la categoría de la pareja, sin códigos', () => {
    expect(nombrePareja('masculino', 1)).toBe('Pareja 1 masculina');
    expect(nombrePareja('femenino', 2)).toBe('Pareja 2 femenina');
    expect(nombrePareja('mixto', 1)).toBe('Pareja mixta');
  });
});

describe('nombrePista', () => {
  it('da el nombre corto de cada pista', () => {
    expect(nombrePista('masculino', 3)).toBe('Masculino 3');
    expect(nombrePista('mixto', 1)).toBe('Mixto');
  });
});

describe('codigoPista', () => {
  it('abrevia masculino y femenino, y deja el mixto entero', () => {
    expect(codigoPista('masculino', 2)).toBe('M2');
    expect(codigoPista('femenino', 1)).toBe('F1');
    expect(codigoPista('mixto', 1)).toBe('Mixto');
  });
});

describe('clavePartido', () => {
  it('identifica cada partido por tipo y número', () => {
    expect(clavePartido({ tipo: 'femenino', numero: 2 })).toBe('femenino-2');
  });
});
