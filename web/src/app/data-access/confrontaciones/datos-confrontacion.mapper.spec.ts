import { mapearFilaDatosConfrontacion } from './datos-confrontacion.mapper';

describe('mapearFilaDatosConfrontacion', () => {
  it('pasa cada dato a su columna', () => {
    expect(
      mapearFilaDatosConfrontacion({
        fechaHora: '2026-10-24T10:00:00.000Z',
        sede: '  Club de Tenis y Pádel Alcobendas ',
        numeroPistas: 3,
      }),
    ).toEqual({
      fecha_hora: '2026-10-24T10:00:00.000Z',
      sede: 'Club de Tenis y Pádel Alcobendas',
      num_pistas: 3,
    });
  });

  it('lo vacío vuelve a «por confirmar»', () => {
    expect(
      mapearFilaDatosConfrontacion({ fechaHora: null, sede: '   ', numeroPistas: null }),
    ).toEqual({ fecha_hora: null, sede: null, num_pistas: null });
  });
});
