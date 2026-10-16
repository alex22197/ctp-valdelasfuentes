import { describirActualizacion } from './ultima-actualizacion';

describe('describirActualizacion', () => {
  it('dice la última vez que la liga la actualizó', () => {
    expect(
      describirActualizacion([
        { actualizadaEn: '2026-10-14T16:00:00Z' },
        { actualizadaEn: '2026-10-21T16:30:00Z' },
        { actualizadaEn: null },
      ]),
    ).toBe('Datos oficiales de la web de la liga, actualizados el miércoles 21 de octubre, 18:30.');
  });

  it('sin datos de la liga, lo dice', () => {
    expect(describirActualizacion([{ actualizadaEn: null }])).toContain('todavía no ha publicado');
    expect(describirActualizacion([])).toContain('todavía no ha publicado');
  });
});
