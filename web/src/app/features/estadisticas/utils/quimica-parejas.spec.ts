import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { EstadisticaJugador } from '@data-access/estadisticas/interfaces/estadistica-jugador.interface';
import { calcularQuimica, signoQuimica } from './quimica-parejas';

const jugador = (id: string, porcentaje: number | null): EstadisticaJugador => ({
  id,
  nombreMostrar: id,
  comodin: false,
  partidos: 2,
  ganados: 1,
  perdidos: 1,
  porcentajeVictorias: porcentaje,
  setsGanados: 0,
  setsPerdidos: 0,
  juegosGanados: 0,
  juegosPerdidos: 0,
  jornadas: 2,
  woAFavor: 0,
});

const pareja = (a: string, b: string, partidos: number, ganados: number): BalancePareja => ({
  tipo: 'masculino',
  jugadorA: { id: a, nombreMostrar: a, comodin: false },
  jugadorB: { id: b, nombreMostrar: b, comodin: false },
  partidos,
  ganados,
  perdidos: partidos - ganados,
  porcentajeVictorias: Math.round((100 * ganados) / partidos),
});

describe('calcularQuimica', () => {
  it('compara a la pareja con la media de sus jugadores y ordena de más a menos', () => {
    const quimica = calcularQuimica(
      [pareja('a', 'b', 2, 0), pareja('c', 'd', 3, 3)],
      [jugador('a', 50), jugador('b', 50), jugador('c', 60), jugador('d', 80)],
    );
    expect(
      quimica.map(
        (q) =>
          `${q.pareja.jugadorA.id}${q.pareja.jugadorB.id} ${q.juntos}/${q.separados} ${q.quimica}`,
      ),
    ).toEqual(['cd 100/70 30', 'ab 0/50 -50']);
  });

  it('deja fuera a las parejas con un solo partido y trata a quien no está como 0 %', () => {
    const quimica = calcularQuimica(
      [pareja('a', 'b', 1, 1), pareja('c', 'd', 2, 1)],
      [jugador('c', 50)],
    );
    expect(quimica).toHaveLength(1);
    expect(quimica[0]).toMatchObject({ juntos: 50, separados: 25, quimica: 25 });
  });

  it('escribe el signo', () => {
    expect(signoQuimica(25)).toBe('+25');
    expect(signoQuimica(0)).toBe('0');
    expect(signoQuimica(-10)).toBe('-10');
  });
});
