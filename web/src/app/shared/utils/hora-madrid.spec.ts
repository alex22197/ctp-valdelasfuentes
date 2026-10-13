import { describirFechaCorta } from './fechas';
import { horaMadridAIso, isoAHoraMadrid } from './hora-madrid';

describe('horaMadridAIso', () => {
  it('en horario de verano Madrid va dos horas por delante', () => {
    expect(horaMadridAIso({ dia: '2026-10-24', hora: '12:00' })).toBe('2026-10-24T10:00:00.000Z');
  });

  it('tras el cambio de hora del 25 de octubre, solo una', () => {
    expect(horaMadridAIso({ dia: '2026-10-31', hora: '12:00' })).toBe('2026-10-31T11:00:00.000Z');
  });

  it('el mismo día del cambio, antes y después de las 3:00', () => {
    expect(horaMadridAIso({ dia: '2026-10-25', hora: '01:30' })).toBe('2026-10-24T23:30:00.000Z');
    expect(horaMadridAIso({ dia: '2026-10-25', hora: '12:00' })).toBe('2026-10-25T11:00:00.000Z');
  });

  it('una hora de noche puede caer en el día anterior en UTC', () => {
    expect(horaMadridAIso({ dia: '2026-11-07', hora: '00:30' })).toBe('2026-11-06T23:30:00.000Z');
  });

  it('el resultado se describe con la hora que se escribió', () => {
    const iso = horaMadridAIso({ dia: '2026-10-10', hora: '12:00' });
    expect(iso).toBe('2026-10-10T10:00:00.000Z');
    expect(describirFechaCorta(iso, null)).toBe('sábado 12:00');
  });
});

describe('isoAHoraMadrid', () => {
  it('devuelve el día y la hora de Madrid a ambos lados del cambio de hora', () => {
    expect(isoAHoraMadrid('2026-10-24T10:00:00Z')).toEqual({ dia: '2026-10-24', hora: '12:00' });
    expect(isoAHoraMadrid('2026-10-31T11:00:00Z')).toEqual({ dia: '2026-10-31', hora: '12:00' });
  });

  it('usa el día de Madrid aunque en UTC sea el anterior', () => {
    expect(isoAHoraMadrid('2026-11-06T23:30:00Z')).toEqual({ dia: '2026-11-07', hora: '00:30' });
  });

  it('ida y vuelta da lo mismo', () => {
    const momento = { dia: '2027-03-28', hora: '18:45' };
    expect(isoAHoraMadrid(horaMadridAIso(momento))).toEqual(momento);
  });
});
