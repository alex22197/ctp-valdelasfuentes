import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoDeJornada } from '@data-access/estadisticas/interfaces/partido-de-jornada.interface';
import { construirCuadricula } from './cuadricula-jornadas';

const FORMATO = { masculino: 3, femenino: 2, mixto: 1 };

const jornada: JornadaJugada = {
  confrontacionId: 'j1',
  faseId: 'f1',
  faseNombre: 'Apertura',
  faseOrden: 1,
  jornada: 1,
  rival: 'Soto Torrejón',
  condicion: 'visitante',
  partidosGanados: 2,
  partidosPerdidos: 2,
  puntos: null,
};

const partido = (
  tipo: PartidoDeJornada['tipo'],
  numero: number,
  ganado: boolean | null,
  resultado: PartidoDeJornada['resultado'] = 'normal',
): PartidoDeJornada => ({ confrontacionId: 'j1', tipo, numero, resultado, ganado });

describe('construirCuadricula', () => {
  it('pone las 6 casillas del formato en orden, aunque falten partidos', () => {
    const [fila] = construirCuadricula(
      [jornada],
      [
        partido('mixto', 1, null, 'suspendido'),
        partido('masculino', 2, true),
        partido('masculino', 1, false),
        partido('femenino', 1, true, 'wo_favor'),
        partido('femenino', 2, false, 'wo_contra'),
        { ...partido('masculino', 3, true), confrontacionId: 'otra' },
      ],
      FORMATO,
    );
    expect(fila?.casillas.map((c) => `${c.codigo}:${c.estado}${c.esWo ? ':WO' : ''}`)).toEqual([
      'M1:perdido',
      'M2:ganado',
      'M3:pendiente',
      'F1:ganado:WO',
      'F2:perdido:WO',
      'Mixto:pendiente',
    ]);
  });

  it('copia rival, marcador y puntos de la jornada', () => {
    const [fila] = construirCuadricula([{ ...jornada, puntos: 1 }], [], FORMATO);
    expect(fila).toMatchObject({
      jornada: 1,
      rival: 'Soto Torrejón',
      condicion: 'visitante',
      marcador: '2-2',
      puntos: 1,
    });
    expect(fila?.casillas[0]?.nombre).toBe('Masculino 1');
  });
});
