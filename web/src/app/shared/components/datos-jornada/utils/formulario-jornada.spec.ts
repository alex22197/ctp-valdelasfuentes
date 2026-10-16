import { formularioDesdeJornada, leerFormularioJornada } from './formulario-jornada';

const vacio = { dia: '', hora: '', sede: '', pistas: '' };

describe('formularioDesdeJornada', () => {
  it('con hora conocida, el día y la hora de Madrid', () => {
    expect(
      formularioDesdeJornada({
        fechaHora: '2026-10-10T10:00:00Z',
        fechaPrevista: '2026-10-10',
        sede: 'Soto Padel',
        numeroPistas: 6,
      }),
    ).toEqual({ dia: '2026-10-10', hora: '12:00', sede: 'Soto Padel', pistas: '6' });
  });

  it('sin hora, el día del calendario oficial y lo demás vacío', () => {
    expect(
      formularioDesdeJornada({
        fechaHora: null,
        fechaPrevista: '2026-10-24',
        sede: null,
        numeroPistas: null,
      }),
    ).toEqual({ ...vacio, dia: '2026-10-24' });
  });
});

describe('leerFormularioJornada', () => {
  it('convierte la hora de Madrid y las pistas', () => {
    expect(
      leerFormularioJornada({ dia: '2026-10-31', hora: '12:00', sede: ' Club ', pistas: '3' }),
    ).toEqual({
      datos: { fechaHora: '2026-10-31T11:00:00.000Z', sede: 'Club', numeroPistas: 3 },
    });
  });

  it('todo vacío vuelve a «por confirmar»', () => {
    expect(leerFormularioJornada(vacio)).toEqual({
      datos: { fechaHora: null, sede: null, numeroPistas: null },
    });
  });

  it('pide el día y la hora juntos', () => {
    expect(leerFormularioJornada({ ...vacio, dia: '2026-10-31' })).toHaveProperty('error');
    expect(leerFormularioJornada({ ...vacio, hora: '12:00' })).toHaveProperty('error');
  });
});
