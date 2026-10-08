import { etiquetaPartido } from './etiquetas-partido';

describe('etiquetaPartido', () => {
  it('incluye el número de pareja en masculino y femenino', () => {
    expect(etiquetaPartido('masculino', 2)).toBe('Masculino, pareja 2');
    expect(etiquetaPartido('femenino', 1)).toBe('Femenino, pareja 1');
  });

  it('no numera el mixto porque solo hay uno', () => {
    expect(etiquetaPartido('mixto', 1)).toBe('Mixto');
  });
});
