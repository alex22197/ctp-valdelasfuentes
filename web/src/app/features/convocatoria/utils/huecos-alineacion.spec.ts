import type { PartidoConResultado } from '@data-access/resultados/interfaces/partido-con-resultado.interface';
import {
  aplicarCambio,
  huecosDesdePartidos,
  mismasParejas,
  parejasParaGuardar,
} from './huecos-alineacion';

function partido(
  tipo: PartidoConResultado['tipo'],
  numero: number,
  reves: string | null,
  resultado: PartidoConResultado['marcador']['resultado'] = null,
): PartidoConResultado {
  return {
    tipo,
    numero,
    reves: reves ? { id: reves, nombreMostrar: reves } : null,
    drive: null,
    marcador: { resultado, ganado: null, sets: [] },
  };
}

describe('huecosDesdePartidos', () => {
  it('toma las parejas guardadas y bloquea las pistas con WO en contra', () => {
    expect(
      huecosDesdePartidos([
        partido('masculino', 1, 'Sergio'),
        partido('masculino', 3, null, 'wo_contra'),
      ]),
    ).toEqual([
      { tipo: 'masculino', numero: 1, idReves: 'Sergio', idDrive: null, bloqueado: false },
      { tipo: 'masculino', numero: 3, idReves: null, idDrive: null, bloqueado: true },
    ]);
  });
});

describe('aplicarCambio y mismasParejas', () => {
  it('cambia solo el lado de la pista indicada y detecta el cambio', () => {
    const huecos = huecosDesdePartidos([
      partido('masculino', 1, 'Sergio'),
      partido('mixto', 1, null),
    ]);
    const cambiados = aplicarCambio(huecos, {
      clave: 'mixto-1',
      lado: 'drive',
      idJugador: 'Rocio',
    });
    expect(cambiados[0]).toBe(huecos[0]);
    expect(cambiados[1]).toMatchObject({ idReves: null, idDrive: 'Rocio' });
    expect(mismasParejas(huecos, cambiados)).toBe(false);
    expect(mismasParejas(huecos, [...huecos])).toBe(true);
  });
});

describe('aplicarCambio al mover a un jugador', () => {
  it('lo saca de su pista anterior en lugar de duplicarlo', () => {
    const huecos = huecosDesdePartidos([
      partido('masculino', 1, 'Sergio'),
      partido('masculino', 2, null),
    ]);
    const movidos = aplicarCambio(huecos, {
      clave: 'masculino-2',
      lado: 'drive',
      idJugador: 'Sergio',
    });
    expect(movidos.map((h) => [h.idReves, h.idDrive])).toEqual([
      [null, null],
      [null, 'Sergio'],
    ]);
  });

  it('lo cambia de lado dentro de la misma pista', () => {
    const huecos = huecosDesdePartidos([partido('masculino', 1, 'Sergio')]);
    const movidos = aplicarCambio(huecos, {
      clave: 'masculino-1',
      lado: 'drive',
      idJugador: 'Sergio',
    });
    expect(movidos[0]).toMatchObject({ idReves: null, idDrive: 'Sergio' });
  });

  it('dejar un lado sin asignar no toca el resto', () => {
    const huecos = huecosDesdePartidos([
      partido('masculino', 1, 'Sergio'),
      partido('masculino', 2, 'Alex'),
    ]);
    const cambiados = aplicarCambio(huecos, {
      clave: 'masculino-1',
      lado: 'reves',
      idJugador: null,
    });
    expect(cambiados[0]).toMatchObject({ idReves: null });
    expect(cambiados[1]).toBe(huecos[1]);
  });
});

describe('parejasParaGuardar', () => {
  it('no envía jugadores en una pista bloqueada', () => {
    expect(
      parejasParaGuardar([
        { tipo: 'masculino', numero: 3, idReves: 'Diego', idDrive: null, bloqueado: true },
      ]),
    ).toEqual([{ tipo: 'masculino', numero: 3, idReves: null, idDrive: null }]);
  });
});
