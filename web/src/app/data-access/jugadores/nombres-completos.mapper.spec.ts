import { mapearNombresCompletos } from './nombres-completos.mapper';

describe('mapearNombresCompletos', () => {
  it('indexa los nombres por jugador y descarta los vacíos', () => {
    const nombres = mapearNombresCompletos([
      { jugador_id: 'pablo', nombre_completo: 'Pablo Ejemplo' },
      { jugador_id: 'vir', nombre_completo: ' Vera Ejemplo ' },
      { jugador_id: 'sergio', nombre_completo: null },
      { jugador_id: 'jorge', nombre_completo: '  ' },
    ]);
    expect([...nombres]).toEqual([
      ['pablo', 'Pablo Ejemplo'],
      ['vir', 'Vera Ejemplo'],
    ]);
  });
});
