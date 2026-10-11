import { describirJugador } from './describir-jugador';

describe('describirJugador', () => {
  it('dice en qué partidos juega y su lado', () => {
    expect(describirJugador('masculino', 'reves')).toBe(
      'Juega en masculino y mixto, normalmente de revés.',
    );
    expect(describirJugador('femenino', 'drive')).toBe(
      'Juega en femenino y mixto, normalmente de drive.',
    );
  });

  it('omite el lado si no se sabe', () => {
    expect(describirJugador('femenino', null)).toBe('Juega en femenino y mixto.');
  });
});
