import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoDeJugador } from '@data-access/estadisticas/interfaces/partido-de-jugador.interface';
import { construirTemporada, describirPartido } from './temporada-jugador';

const jornada = (id: string, faseOrden: number, numero: number): JornadaJugada => ({
  confrontacionId: id,
  faseId: `f${faseOrden}`,
  faseNombre: faseOrden === 1 ? 'Apertura' : 'Clausura',
  faseOrden,
  jornada: numero,
  rival: 'Soto Torrejón',
  condicion: 'visitante',
  partidosGanados: 3,
  partidosPerdidos: 3,
  puntos: 1,
});

const partido = (cambios: Partial<PartidoDeJugador> = {}): PartidoDeJugador => ({
  confrontacionId: 'j1',
  tipo: 'masculino',
  numero: 1,
  lado: 'reves',
  ganado: true,
  esWo: false,
  marcador: '6-3 6-4',
  juegosGanados: 12,
  juegosPerdidos: 7,
  companero: { id: 'jorge', nombreMostrar: 'Jorge' },
  ...cambios,
});

describe('construirTemporada', () => {
  it('pone cada partido en su jornada y deja vacías las que no jugó', () => {
    const [apertura] = construirTemporada(
      [jornada('j1', 1, 1), jornada('j2', 1, 2)],
      [partido({ ganado: false, marcador: '3-6 4-6', juegosGanados: 7, juegosPerdidos: 12 })],
    );
    expect(apertura?.filas).toEqual([
      {
        confrontacionId: 'j1',
        jornada: 1,
        rival: 'Soto Torrejón',
        condicion: 'visitante',
        resultado: 'perdido',
        detalle: 'Masculino 1 con Jorge, de revés',
        marcador: '3-6 4-6',
        diferenciaJuegos: -5,
        esWo: false,
      },
      {
        confrontacionId: 'j2',
        jornada: 2,
        rival: 'Soto Torrejón',
        condicion: 'visitante',
        resultado: 'no-jugo',
        detalle: null,
        marcador: null,
        diferenciaJuegos: null,
        esWo: false,
      },
    ]);
  });

  it('agrupa por fase en el orden en que llegan', () => {
    const fases = construirTemporada(
      [jornada('a1', 1, 1), jornada('c1', 2, 1), jornada('a2', 1, 2)],
      [],
    );
    expect(fases.map((f) => `${f.nombre}:${f.filas.length}`)).toEqual(['Apertura:2', 'Clausura:1']);
  });

  it('escribe «WO a favor» en lugar del marcador', () => {
    const [fase] = construirTemporada(
      [jornada('j1', 1, 1)],
      [partido({ esWo: true, marcador: null })],
    );
    expect(fase?.filas[0]?.resultado).toBe('ganado');
    expect(fase?.filas[0]?.marcador).toBe('WO a favor');
    expect(fase?.filas[0]?.diferenciaJuegos).toBeNull();
    expect(fase?.filas[0]?.esWo).toBe(true);
  });

  it('sin jornadas jugadas devuelve una lista vacía', () => {
    expect(construirTemporada([], [])).toEqual([]);
  });
});

describe('describirPartido', () => {
  it('nombra el mixto sin número y aguanta que falte el compañero', () => {
    expect(describirPartido(partido({ tipo: 'mixto', lado: 'drive', companero: null }))).toBe(
      'Mixto, de drive',
    );
  });
});
