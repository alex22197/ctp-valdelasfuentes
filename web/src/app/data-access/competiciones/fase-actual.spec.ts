import { elegirFaseActual, elegirFaseConClasificacion } from './fase-actual';
import type { Fase } from './interfaces/fase.interface';
import type { TipoFase } from './interfaces/tipo-fase.type';

function fase(
  orden: number,
  inicio: string | null,
  fin: string | null = null,
  tipo: TipoFase = 'apertura',
): Fase {
  return {
    id: `fase-${orden}`,
    tipo,
    nombre: `Fase ${orden}`,
    orden,
    urlGrupo: null,
    inicio,
    fin,
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

  it('acabada una fase, pasa a la siguiente aunque no haya empezado', () => {
    const conFin = [fase(1, '2026-10-10', '2026-10-25'), fase(2, '2026-11-07', '2026-11-08')];
    expect(elegirFaseActual(conFin, '2026-10-25')?.orden).toBe(1);
    expect(elegirFaseActual(conFin, '2026-10-27')?.orden).toBe(2);
  });

  it('acabada la última, se queda en ella', () => {
    expect(elegirFaseActual([fase(1, '2026-10-10', '2026-10-25')], '2026-12-01')?.orden).toBe(1);
  });

  it('devuelve null si no hay fases', () => {
    expect(elegirFaseActual([], '2026-10-10')).toBeNull();
  });
});

describe('elegirFaseConClasificacion', () => {
  const apertura = fase(1, '2026-10-10', '2026-10-25');
  const retos = fase(2, '2026-11-07', null, 'retos');
  const clausura = fase(3, '2026-11-14', null, 'clausura');

  it('una liga enseña la suya', () => {
    expect(elegirFaseConClasificacion([apertura, retos, clausura], clausura)?.orden).toBe(3);
  });

  it('una eliminatoria enseña la última liga anterior', () => {
    expect(elegirFaseConClasificacion([retos, apertura, clausura], retos)?.orden).toBe(1);
  });

  it('sin liga anterior, nada', () => {
    expect(elegirFaseConClasificacion([retos], retos)).toBeNull();
  });
});
