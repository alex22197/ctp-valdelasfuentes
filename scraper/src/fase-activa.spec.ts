import { describe, expect, it } from 'vitest';
import { faseActiva, hoyEnMadrid } from './fase-activa.ts';

const fase = (inicio: string | null, fin: string | null) => ({
  id: 'f',
  nombre: 'Fase',
  tipo: 'apertura',
  urlGrupo: 'https://liga/grupo',
  inicio,
  fin,
});

describe('faseActiva', () => {
  it('una fase en juego o sin fechas se lee', () => {
    expect(faseActiva(fase('2026-11-14', null), '2026-11-18')).toBe(true);
    expect(faseActiva(fase(null, null), '2026-11-18')).toBe(true);
  });

  it('una fase que no ha empezado, no', () => {
    expect(faseActiva(fase('2026-12-12', null), '2026-11-18')).toBe(false);
  });

  it('una fase acabada se sigue leyendo una semana, por si la liga corrige algo', () => {
    expect(faseActiva(fase('2026-10-10', '2026-10-25'), '2026-11-01')).toBe(true);
    expect(faseActiva(fase('2026-10-10', '2026-10-25'), '2026-11-02')).toBe(false);
  });
});

describe('hoyEnMadrid', () => {
  it('usa el día de Madrid aunque en UTC sea el anterior', () => {
    expect(hoyEnMadrid(new Date('2026-11-17T23:30:00Z'))).toBe('2026-11-18');
  });
});
