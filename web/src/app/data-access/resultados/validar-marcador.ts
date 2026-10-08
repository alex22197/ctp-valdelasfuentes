import type { ErrorMarcador } from './interfaces/error-marcador.interface';
import type { MarcadorPartido } from './interfaces/marcador-partido.interface';
import type { SetPartido } from './interfaces/set-partido.interface';

/**
 * Comprueba un marcador con las reglas de la normativa antes de enviarlo: mejor de 3 sets,
 * cada set termina 6-0 a 6-4, 7-5 o 7-6, y el tie-break se gana a 7 con 2 de diferencia.
 * Los abandonos y suspendidos pueden dejar a medias el último set.
 *
 * Es la misma validación que hace la base de datos (`validar_marcador`), con los mismos
 * mensajes, para mostrar el error junto al set sin esperar al servidor. Devuelve el primer
 * error que encuentra, o `null` si el marcador es válido.
 */
export function validarMarcador(marcador: MarcadorPartido): ErrorMarcador | null {
  const { resultado, ganado, sets } = marcador;

  if (resultado === 'abandono' && ganado === null) {
    return errorGeneral('Indica qué pareja ganó el partido abandonado');
  }
  if (resultado !== 'abandono' && ganado !== null) {
    return errorGeneral(
      'Solo se indica quién ganó en los abandonos; en el resto lo deciden los sets',
    );
  }
  if (resultado === null && sets.length > 0) {
    return errorGeneral('Un partido por jugar no tiene sets');
  }
  if ((resultado === 'wo_favor' || resultado === 'wo_contra') && sets.length > 0) {
    return errorGeneral('Un partido con WO no tiene sets');
  }
  if (sets.length > 3) {
    return errorGeneral('Un partido tiene como máximo 3 sets');
  }

  let setsNuestros = 0;
  let setsRival = 0;
  for (const [indice, set] of sets.entries()) {
    const numeroSet = indice + 1;
    if (setsNuestros === 2 || setsRival === 2) {
      return errorEnSet(numeroSet, 'El partido ya estaba decidido; sobra este set');
    }

    const errorSet = validarSet(set);
    if (errorSet) {
      return errorEnSet(numeroSet, errorSet);
    }

    if (setTerminado(set)) {
      if (set.juegosNuestros > set.juegosRival) {
        setsNuestros++;
      } else {
        setsRival++;
      }
    } else if (resultado === 'normal') {
      return errorEnSet(
        numeroSet,
        `Con ${set.juegosNuestros}-${set.juegosRival} el set no ha terminado`,
      );
    } else if (numeroSet < sets.length) {
      return errorEnSet(numeroSet, 'Solo el último set puede quedar a medias');
    }
  }

  const maximoSets = Math.max(setsNuestros, setsRival);
  if (resultado === 'normal' && maximoSets < 2) {
    return errorGeneral('Faltan sets: el partido lo gana la primera pareja que gana dos');
  }
  if ((resultado === 'abandono' || resultado === 'suspendido') && maximoSets === 2) {
    return errorGeneral(
      'Una pareja ya ha ganado dos sets: el partido terminó con resultado normal',
    );
  }
  return null;
}

/** Un set está terminado si acaba 6-0 a 6-4, 7-5 o 7-6 (en cualquier sentido). */
export function setTerminado(set: SetPartido): boolean {
  const mayor = Math.max(set.juegosNuestros, set.juegosRival);
  const menor = Math.min(set.juegosNuestros, set.juegosRival);
  return (mayor === 6 && menor <= 4) || mayor === 7;
}

/** `true` si el set acaba 7-6 o 6-7, el único caso en el que hay tie-break. */
export function setConTiebreak(juegosNuestros: number, juegosRival: number): boolean {
  return Math.max(juegosNuestros, juegosRival) === 7 && Math.min(juegosNuestros, juegosRival) === 6;
}

function validarSet(set: SetPartido): string | null {
  const { juegosNuestros, juegosRival, tiebreakNuestros, tiebreakRival } = set;
  if (![juegosNuestros, juegosRival].every((juegos) => Number.isInteger(juegos))) {
    return 'Faltan los juegos de alguna pareja';
  }
  if ([juegosNuestros, juegosRival].some((juegos) => juegos < 0 || juegos > 7)) {
    return 'Los juegos van de 0 a 7';
  }
  const mayor = Math.max(juegosNuestros, juegosRival);
  const menor = Math.min(juegosNuestros, juegosRival);
  if (mayor === 7 && menor !== 5 && menor !== 6) {
    return `${juegosNuestros}-${juegosRival} no es posible; a 7 juegos solo se llega con 7-5 o 7-6`;
  }

  if ((tiebreakNuestros === null) !== (tiebreakRival === null)) {
    return 'Indica los puntos del tie-break de las dos parejas';
  }
  if (tiebreakNuestros !== null && tiebreakRival !== null) {
    if (!setConTiebreak(juegosNuestros, juegosRival)) {
      return 'Solo hay tie-break cuando el set acaba 7-6';
    }
    if (!tiebreakValido(tiebreakNuestros, tiebreakRival)) {
      return 'El tie-break se gana a 7 puntos con 2 de diferencia';
    }
    if (tiebreakNuestros > tiebreakRival !== juegosNuestros > juegosRival) {
      return 'El tie-break lo gana la pareja que gana el set';
    }
  }
  return null;
}

function tiebreakValido(nuestros: number, rival: number): boolean {
  if (!Number.isInteger(nuestros) || !Number.isInteger(rival) || nuestros < 0 || rival < 0) {
    return false;
  }
  const mayor = Math.max(nuestros, rival);
  const menor = Math.min(nuestros, rival);
  return (mayor === 7 && menor <= 5) || (mayor > 7 && mayor - menor === 2);
}

function errorGeneral(mensaje: string): ErrorMarcador {
  return { numeroSet: null, mensaje };
}

function errorEnSet(numeroSet: number, mensaje: string): ErrorMarcador {
  return { numeroSet, mensaje };
}
