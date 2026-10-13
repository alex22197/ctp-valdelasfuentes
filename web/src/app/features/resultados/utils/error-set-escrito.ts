import { setConTiebreak, validarSet } from '@data-access/resultados/validar-marcador';
import type { SetFormulario } from '../interfaces/set-formulario.interface';

/**
 * Error de un set mientras se escribe, para avisar sin esperar a «Guardar». Solo juzga lo
 * que ya está escrito:
 * - unos juegos fuera de 0 a 7, en cuanto se escriben;
 * - el set entero (un 7-2, un tie-break imposible…) cuando están los juegos de las dos
 *   parejas, y el tie-break solo cuando están sus dos puntos.
 * Que el set haya terminado o que falten sets lo comprueba «Guardar»: mientras se escribe
 * todavía pueden faltar.
 */
export function errorAlEscribirSet(set: SetFormulario): string | null {
  const escritos = [set.juegosNuestros, set.juegosRival]
    .map((texto) => texto.trim())
    .filter((texto) => texto !== '')
    .map(Number);
  if (escritos.some((juegos) => !Number.isInteger(juegos) || juegos < 0 || juegos > 7)) {
    return 'Los juegos van de 0 a 7';
  }
  const [juegosNuestros, juegosRival] = escritos;
  if (juegosNuestros === undefined || juegosRival === undefined) {
    return null;
  }

  const tiebreakNuestros = set.tiebreakNuestros.trim();
  const tiebreakRival = set.tiebreakRival.trim();
  const conTiebreak =
    tiebreakNuestros !== '' && tiebreakRival !== '' && setConTiebreak(juegosNuestros, juegosRival);
  return validarSet({
    juegosNuestros,
    juegosRival,
    tiebreakNuestros: conTiebreak ? Number(tiebreakNuestros) : null,
    tiebreakRival: conTiebreak ? Number(tiebreakRival) : null,
  });
}
