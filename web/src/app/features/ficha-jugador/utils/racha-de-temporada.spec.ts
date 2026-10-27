import type { FilaTemporada } from '../interfaces/fila-temporada.interface';
import { rachaDeTemporada } from './racha-de-temporada';

const fila = (resultado: FilaTemporada['resultado'], esWo = false): FilaTemporada => ({
  confrontacionId: resultado + String(esWo),
  jornada: 1,
  rival: 'Rival',
  condicion: 'local',
  resultado,
  detalle: null,
  marcador: null,
  diferenciaJuegos: null,
  esWo,
});

describe('rachaDeTemporada', () => {
  it('sigue el orden de las fases y salta las jornadas sin jugar y los WO', () => {
    expect(
      rachaDeTemporada([
        { nombre: 'Apertura', filas: [fila('ganado'), fila('perdido')] },
        { nombre: 'Clausura', filas: [fila('no-jugo'), fila('perdido'), fila('ganado', true)] },
      ]),
    ).toEqual({ tipo: 'derrotas', largo: 2 });
  });

  it('sin partidos, nada', () => {
    expect(rachaDeTemporada([{ nombre: 'Apertura', filas: [fila('no-jugo')] }])).toBeNull();
  });
});
