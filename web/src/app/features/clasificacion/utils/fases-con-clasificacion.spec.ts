import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import { fasesConClasificacion } from './fases-con-clasificacion';

const fase = (orden: number, tipo: Fase['tipo'], inicio: string, fin: string | null): Fase => ({
  id: `f${orden}`,
  tipo,
  nombre: `Fase ${orden}`,
  orden,
  urlGrupo: null,
  inicio,
  fin,
});

const temporada = [
  fase(1, 'apertura', '2026-10-10', '2026-10-25'),
  fase(2, 'retos', '2026-11-07', '2026-11-08'),
  fase(3, 'clausura', '2026-11-14', null),
];

describe('fasesConClasificacion', () => {
  it('solo las ligas, la más reciente primero y con su estado', () => {
    expect(fasesConClasificacion(temporada, '2026-11-17')).toEqual([
      { fase: temporada[2], estado: 'en-juego' },
      { fase: temporada[0], estado: 'terminada' },
    ]);
  });

  it('durante los retos, la apertura ya está terminada y el clausura es el próximo', () => {
    expect(fasesConClasificacion(temporada, '2026-11-07').map((f) => f.estado)).toEqual([
      'proxima',
      'terminada',
    ]);
  });

  it('sin fases, nada', () => {
    expect(fasesConClasificacion([], '2026-11-17')).toEqual([]);
  });
});
