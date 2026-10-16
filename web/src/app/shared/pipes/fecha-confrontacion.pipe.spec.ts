import { FechaConfrontacionPipe } from './fecha-confrontacion.pipe';

describe('FechaConfrontacionPipe', () => {
  const pipe = new FechaConfrontacionPipe();

  it('usa el día y la hora si se conocen', () => {
    expect(pipe.transform({ fechaHora: '2026-10-18T11:30:00Z', fechaPrevista: '2026-10-17' })).toBe(
      'Domingo 18 de octubre, 13:30',
    );
  });

  it('sin hora, el fin de semana; sin nada, por confirmar', () => {
    expect(pipe.transform({ fechaHora: null, fechaPrevista: '2026-10-24' })).toBe(
      'Fin de semana del 24 de octubre',
    );
    expect(pipe.transform({ fechaHora: null, fechaPrevista: null })).toBe('Fecha por confirmar');
  });
});
