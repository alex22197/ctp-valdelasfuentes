import { mapearParejasAParametros, mapearPartidoAlineacion } from './alineacion.mapper';

describe('mapearPartidoAlineacion', () => {
  it('coloca a cada jugador en su lado', () => {
    const partido = mapearPartidoAlineacion({
      id: 'm1',
      tipo: 'masculino',
      numero: 1,
      participacion: [
        { lado: 'drive', jugador: { id: 'jorge', nombre_mostrar: 'Jorge' } },
        { lado: 'reves', jugador: { id: 'sergio', nombre_mostrar: 'Sergio' } },
      ],
    });
    expect(partido.reves?.nombreMostrar).toBe('Sergio');
    expect(partido.drive?.nombreMostrar).toBe('Jorge');
  });

  it('deja vacío el lado que aún no tiene jugador', () => {
    const partido = mapearPartidoAlineacion({
      id: 'x',
      tipo: 'mixto',
      numero: 1,
      participacion: [],
    });
    expect(partido.reves).toBeNull();
    expect(partido.drive).toBeNull();
  });
});

describe('mapearParejasAParametros', () => {
  it('pasa cada pareja al formato de guardar_alineacion', () => {
    expect(
      mapearParejasAParametros([{ tipo: 'mixto', numero: 1, idReves: 'rocio', idDrive: null }]),
    ).toEqual([{ tipo: 'mixto', numero: 1, reves: 'rocio', drive: null }]);
  });
});
