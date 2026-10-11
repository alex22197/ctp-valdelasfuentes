import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import type { JugadorPlantilla } from '@data-access/jugadores/interfaces/jugador-plantilla.interface';
import { agruparPlantilla } from './agrupar-plantilla';

const jugador = (
  id: string,
  nombreMostrar: string,
  sexo: JugadorPlantilla['sexo'],
  comodin = false,
): JugadorPlantilla => ({ id, nombreMostrar, sexo, ladoPreferido: null, comodin });

const resumen = (partidos: number, porcentajeVictorias: number | null): ResumenJugador => ({
  partidos,
  ganados: 0,
  perdidos: 0,
  porcentajeVictorias,
  setsGanados: 0,
  setsPerdidos: 0,
  juegosGanados: 0,
  juegosPerdidos: 0,
  jornadas: 0,
  woAFavor: 0,
});

describe('agruparPlantilla', () => {
  const jugadores = [
    jugador('s', 'Sergio', 'masculino'),
    jugador('a', 'Álvaro', 'masculino'),
    jugador('al', 'Alex', 'masculino'),
    jugador('r', 'Rocio', 'femenino'),
    jugador('j', 'Jess', 'femenino', true),
  ];

  it('separa chicos, chicas y comodines por orden alfabético con tildes', () => {
    const grupos = agruparPlantilla(jugadores, new Map());
    expect(grupos.chicos.map((f) => f.nombreMostrar)).toEqual(['Alex', 'Álvaro', 'Sergio']);
    expect(grupos.chicas.map((f) => f.nombreMostrar)).toEqual(['Rocio']);
    expect(grupos.comodines.map((f) => f.nombreMostrar)).toEqual(['Jess']);
  });

  it('añade partidos y porcentaje, o cero partidos si no ha jugado', () => {
    const grupos = agruparPlantilla(jugadores, new Map([['s', resumen(3, 67)]]));
    expect(grupos.chicos.find((f) => f.id === 's')).toEqual({
      id: 's',
      nombreMostrar: 'Sergio',
      iniciales: 'Se',
      partidos: 3,
      porcentajeVictorias: 67,
    });
    expect(grupos.chicos.find((f) => f.id === 'al')).toMatchObject({
      partidos: 0,
      porcentajeVictorias: null,
    });
  });
});
