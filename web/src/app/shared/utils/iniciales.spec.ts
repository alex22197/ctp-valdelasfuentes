import { iniciales } from './iniciales';

describe('iniciales', () => {
  it('toma la inicial de las dos primeras palabras', () => {
    expect(iniciales('Marta Prieto')).toBe('MP');
    expect(iniciales('Ivan G')).toBe('IG');
    expect(iniciales('  marta   morales ')).toBe('MM');
  });

  it('con una sola palabra usa sus dos primeras letras, con tildes', () => {
    expect(iniciales('Sergio')).toBe('Se');
    expect(iniciales('Álvaro')).toBe('Ál');
  });

  it('no se rompe con un nombre vacío', () => {
    expect(iniciales('')).toBe('?');
  });
});
