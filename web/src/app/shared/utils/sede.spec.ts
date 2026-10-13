import { describirSede } from './sede';

describe('describirSede', () => {
  it('saca el nombre y la dirección de una búsqueda de Google Maps', () => {
    const enlace =
      'https://www.google.com/maps?q=Padel+Attraction+Indoor,+C.+Grafito,+29,+28850+Torrej%C3%B3n+de+Ardoz,+Madrid&ftid=0xd422ec&g_st=iw';
    expect(describirSede(enlace)).toEqual({
      nombre: 'Padel Attraction Indoor',
      direccion: 'C. Grafito, 29, 28850 Torrejón de Ardoz, Madrid',
      enlace,
    });
  });

  it('también de un enlace de lugar', () => {
    expect(
      describirSede('https://www.google.com/maps/place/Club+de+Tenis+Alcobendas/@40.5,-3.6,17z'),
    ).toMatchObject({ nombre: 'Club de Tenis Alcobendas', direccion: null });
  });

  it('un enlace corto o con coordenadas no trae nombre', () => {
    expect(describirSede('https://maps.app.goo.gl/AbCdEf123')).toEqual({
      nombre: null,
      direccion: null,
      enlace: 'https://maps.app.goo.gl/AbCdEf123',
    });
    expect(describirSede('https://www.google.com/maps?q=40.52,-3.64')?.nombre).toBeNull();
  });

  it('un texto se queda como texto', () => {
    expect(describirSede('  Polideportivo de Valdelasfuentes ')).toEqual({
      nombre: 'Polideportivo de Valdelasfuentes',
      direccion: null,
      enlace: null,
    });
  });

  it('no enlaza nada que no sea https', () => {
    expect(describirSede('javascript:alert(1)')?.enlace).toBeNull();
    expect(describirSede('http://maps.google.com/?q=Club')?.enlace).toBeNull();
  });

  it('sin sede, nada', () => {
    expect(describirSede(null)).toBeNull();
    expect(describirSede('   ')).toBeNull();
  });
});
