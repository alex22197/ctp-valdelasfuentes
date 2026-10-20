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
): PartidoDeJornada => ({
  confrontacionId: 'j1',
  tipo,
  numero,
  resultado,
  ganado,
  reves: null,
  drive: null,
  sets: [],
});

describe('construirCuadricula', () => {
  it('agrupa los partidos del formato por categoría y en orden, aunque falten', () => {
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
    expect(
      fila?.grupos.map(
        (g) => `${g.nombre}: ${g.casillas.map((c) => c.estado + (c.nota ? `/${c.nota}` : ''))}`,
      ),
    ).toEqual([
      'Masculino: perdido,ganado,pendiente',
      'Femenino: ganado/WO,perdido/WO',
      'Mixto: pendiente/Suspendido',
    ]);
    expect(fila?.grupos[0]?.casillas[1]).toMatchObject({
      nombre: 'Masculino, pareja 2',
      etiqueta: 'Pareja 2',
    });
    expect(fila?.grupos[2]?.casillas[0]?.etiqueta).toBeNull();
  });

  it('pone quién jugó y los sets', () => {
    const [fila] = construirCuadricula(
      [jornada],
      [
        {
          ...partido('masculino', 1, true),
          reves: { id: 'a', nombreMostrar: 'Pablo' },
          drive: { id: 'b', nombreMostrar: 'Iván' },
          sets: [
            { juegosNuestros: 6, juegosRival: 3, tiebreakNuestros: null, tiebreakRival: null },
            { juegosNuestros: 7, juegosRival: 6, tiebreakNuestros: 7, tiebreakRival: 4 },
          ],
        },
      ],
      FORMATO,
    );
    expect(fila?.grupos[0]?.casillas[0]).toMatchObject({
      pareja: 'Pablo y Iván',
      sets: ['6-3', '7-6'],
      nota: null,
    });
    expect(fila?.grupos[0]?.casillas[1]).toMatchObject({ pareja: null, sets: [] });
  });

  it('se salta las categorías que el formato no tiene', () => {
    const [fila] = construirCuadricula([jornada], [], { masculino: 2, femenino: 0, mixto: 1 });
    expect(fila?.grupos.map((g) => g.casillas.length)).toEqual([2, 1]);
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
  });
});
