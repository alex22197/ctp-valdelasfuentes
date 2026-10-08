import { elegirFaseActual } from './fase-actual';
import type { Fase } from './interfaces/fase.interface';

function fase(orden: number, inicio: string | null): Fase {
  return {
    id: `fase-${orden}`,
    tipo: 'apertura',
    nombre: `Fase ${orden}`,
    orden,
    urlGrupo: null,
    inicio,
  };
}

describe('elegirFaseActual', () => {
  const fases = [fase(3, '2026-11-14'), fase(1, '2026-10-10'), fase(2, '2026-11-07')];

  it('elige la última fase que ya ha empezado', () => {
    expect(elegirFaseActual(fases, '2026-11-08')?.orden).toBe(2);
  });

  it('cuenta como empezada la fase que empieza hoy', () => {
    expect(elegirFaseActual(fases, '2026-11-14')?.orden).toBe(3);
  });

  it('elige la primera si ninguna ha empezado', () => {
    expect(elegirFaseActual(fases, '2026-09-01')?.orden).toBe(1);
  });

  it('devuelve null si no hay fases', () => {
    expect(elegirFaseActual([], '2026-10-10')).toBeNull();
  });
});
