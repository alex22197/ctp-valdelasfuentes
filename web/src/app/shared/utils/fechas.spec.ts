import { describirFechaConfrontacion, fechaIsoEnMadrid } from './fechas';

describe('fechas', () => {
  describe('fechaIsoEnMadrid', () => {
    it('usa el día de Madrid aunque en UTC sea todavía el día anterior', () => {
      expect(fechaIsoEnMadrid(new Date('2026-10-09T22:30:00Z'))).toBe('2026-10-10');
    });
  });

  describe('describirFechaConfrontacion', () => {
    it('muestra día y hora en Madrid cuando se conocen', () => {
      expect(describirFechaConfrontacion('2026-10-10T10:00:00Z', '2026-10-10')).toBe(
        'Sábado 10 de octubre, 12:00',
      );
    });

    it('muestra el fin de semana cuando solo hay fecha del calendario', () => {
      expect(describirFechaConfrontacion(null, '2026-10-17')).toBe(
        'Fin de semana del 17 de octubre',
      );
    });

    it('avisa de que falta la fecha cuando no hay ninguna', () => {
      expect(describirFechaConfrontacion(null, null)).toBe('Fecha por confirmar');
    });
  });
});
