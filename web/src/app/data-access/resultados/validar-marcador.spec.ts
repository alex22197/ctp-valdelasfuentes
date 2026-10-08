import type { MarcadorPartido } from './interfaces/marcador-partido.interface';
import type { SetPartido } from './interfaces/set-partido.interface';
import { setTerminado, validarMarcador } from './validar-marcador';

function set(
  juegosNuestros: number,
  juegosRival: number,
  tiebreakNuestros: number | null = null,
  tiebreakRival: number | null = null,
): SetPartido {
  return { juegosNuestros, juegosRival, tiebreakNuestros, tiebreakRival };
}

function marcador(cambios: Partial<MarcadorPartido>): MarcadorPartido {
  return { resultado: 'normal', ganado: null, sets: [], ...cambios };
}

describe('validarMarcador', () => {
  it('acepta un partido normal a dos sets', () => {
    expect(validarMarcador(marcador({ sets: [set(6, 4), set(6, 3)] }))).toBeNull();
  });

  it('acepta un partido a tres sets con tie-breaks', () => {
    const sets = [set(6, 7, 5, 7), set(7, 6, 7, 2), set(7, 6, 12, 10)];
    expect(validarMarcador(marcador({ sets }))).toBeNull();
  });

  it('acepta un 7-6 sin apuntar el tie-break', () => {
    expect(validarMarcador(marcador({ sets: [set(7, 6), set(6, 0)] }))).toBeNull();
  });

  it('pide más sets si nadie ha ganado dos', () => {
    expect(validarMarcador(marcador({ sets: [set(6, 4)] }))?.mensaje).toContain('Faltan sets');
  });

  it('rechaza un set de más y dice cuál', () => {
    const error = validarMarcador(marcador({ sets: [set(6, 4), set(6, 3), set(6, 0)] }));
    expect(error?.numeroSet).toBe(3);
  });

  it('rechaza un set sin terminar en un partido normal', () => {
    const error = validarMarcador(marcador({ sets: [set(6, 5), set(6, 3)] }));
    expect(error).toEqual({ numeroSet: 1, mensaje: 'Con 6-5 el set no ha terminado' });
  });

  it('rechaza marcadores imposibles', () => {
    expect(validarMarcador(marcador({ sets: [set(7, 3), set(6, 0)] }))?.mensaje).toContain(
      'no es posible',
    );
    expect(validarMarcador(marcador({ sets: [set(8, 6), set(6, 0)] }))?.mensaje).toBe(
      'Los juegos van de 0 a 7',
    );
  });

  it('comprueba el tie-break', () => {
    const conTiebreak = (a: number, b: number, ta: number, tb: number): string | undefined =>
      validarMarcador(marcador({ sets: [set(a, b, ta, tb), set(6, 0)] }))?.mensaje;
    expect(conTiebreak(6, 4, 7, 5)).toBe('Solo hay tie-break cuando el set acaba 7-6');
    expect(conTiebreak(7, 6, 7, 6)).toBe('El tie-break se gana a 7 puntos con 2 de diferencia');
    expect(conTiebreak(7, 6, 10, 7)).toBe('El tie-break se gana a 7 puntos con 2 de diferencia');
    expect(conTiebreak(7, 6, 4, 7)).toBe('El tie-break lo gana la pareja que gana el set');
    expect(conTiebreak(7, 6, 9, 7)).toBeUndefined();
  });

  it('pide quién ganó en un abandono, y solo en un abandono', () => {
    const sets = [set(6, 4), set(2, 1)];
    expect(validarMarcador(marcador({ resultado: 'abandono', sets }))?.mensaje).toContain(
      'Indica qué pareja',
    );
    expect(validarMarcador(marcador({ resultado: 'abandono', ganado: false, sets }))).toBeNull();
    expect(
      validarMarcador(marcador({ ganado: true, sets: [set(6, 4), set(6, 4)] }))?.mensaje,
    ).toContain('Solo se indica');
  });

  it('en un abandono solo el último set puede quedar a medias', () => {
    const error = validarMarcador(
      marcador({ resultado: 'abandono', ganado: true, sets: [set(2, 1), set(6, 4)] }),
    );
    expect(error?.numeroSet).toBe(1);
  });

  it('rechaza un suspendido en el que ya hay ganador', () => {
    const error = validarMarcador(
      marcador({ resultado: 'suspendido', sets: [set(6, 4), set(6, 4)] }),
    );
    expect(error?.mensaje).toContain('resultado normal');
  });

  it('no admite sets en un WO ni en un partido por jugar', () => {
    expect(validarMarcador(marcador({ resultado: 'wo_favor' }))).toBeNull();
    expect(validarMarcador(marcador({ resultado: 'wo_contra', sets: [set(0, 6)] }))?.mensaje).toBe(
      'Un partido con WO no tiene sets',
    );
    expect(validarMarcador(marcador({ resultado: null, sets: [set(1, 0)] }))?.mensaje).toBe(
      'Un partido por jugar no tiene sets',
    );
  });
});

describe('setTerminado', () => {
  it('distingue los sets terminados de los que van a medias', () => {
    expect(setTerminado(set(6, 4))).toBe(true);
    expect(setTerminado(set(5, 7))).toBe(true);
    expect(setTerminado(set(6, 5))).toBe(false);
    expect(setTerminado(set(6, 6))).toBe(false);
  });
});
