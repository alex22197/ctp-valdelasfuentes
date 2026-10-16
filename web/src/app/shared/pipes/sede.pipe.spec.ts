import { SedePipe } from './sede.pipe';

describe('SedePipe', () => {
  const pipe = new SedePipe();

  it('describe un enlace de Google Maps', () => {
    expect(pipe.transform('https://www.google.com/maps?q=Club+Prueba,+Calle+1')).toMatchObject({
      nombre: 'Club Prueba',
      direccion: 'Calle 1',
    });
  });

  it('sin sede, nada', () => {
    expect(pipe.transform(null)).toBeNull();
  });
});
