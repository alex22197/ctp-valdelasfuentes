import { mapearJornadasJugadas } from './jornada-jugada.mapper';

describe('mapearJornadasJugadas', () => {
  const fila = {
    confrontacion_id: 'c1',
    fase_id: 'f1',
    fase_nombre: 'Apertura',
    fase_orden: 1,
    jornada: 1,
    rival_nombre: 'Soto Torrejón',
    condicion: 'visitante',
    partidos_ganados: 1,
    partidos_perdidos: 5,
    puntos: 0,
  };

  it('pasa la jornada a camelCase', () => {
    expect(mapearJornadasJugadas([fila])).toEqual([
      {
        confrontacionId: 'c1',
        faseId: 'f1',
        faseNombre: 'Apertura',
        faseOrden: 1,
        jornada: 1,
        rival: 'Soto Torrejón',
        condicion: 'visitante',
        partidosGanados: 1,
        partidosPerdidos: 5,
        puntos: 0,
      },
    ]);
  });

  it('reconoce cuando jugamos en casa', () => {
    expect(mapearJornadasJugadas([{ ...fila, condicion: 'local' }])[0]?.condicion).toBe('local');
  });

  it('descarta filas sin rival o sin fase', () => {
    expect(mapearJornadasJugadas([{ ...fila, rival_nombre: null }])).toEqual([]);
    expect(mapearJornadasJugadas([{ ...fila, fase_orden: null }])).toEqual([]);
  });
});
