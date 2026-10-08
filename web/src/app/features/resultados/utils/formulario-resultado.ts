import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { MarcadorPartido } from '@data-access/resultados/interfaces/marcador-partido.interface';
import type { SetPartido } from '@data-access/resultados/interfaces/set-partido.interface';
import type { TipoResultadoPartido } from '@data-access/resultados/interfaces/tipo-resultado-partido.type';
import { setConTiebreak } from '@data-access/resultados/validar-marcador';
import type { OpcionResultado } from '../interfaces/opcion-resultado.interface';
import type { SetFormulario } from '../interfaces/set-formulario.interface';

/** Mejor de 3 sets: el formulario siempre ofrece tres filas. */
export const SETS_POR_PARTIDO = 3;

export const OPCIONES_RESULTADO: readonly OpcionResultado[] = [
  { valor: null, etiqueta: 'Por jugar' },
  { valor: 'normal', etiqueta: 'Jugado' },
  { valor: 'wo_favor', etiqueta: 'WO a favor' },
  { valor: 'wo_contra', etiqueta: 'WO en contra' },
  { valor: 'abandono', etiqueta: 'Abandono' },
  { valor: 'suspendido', etiqueta: 'Suspendido' },
];

const SET_VACIO: SetFormulario = {
  juegosNuestros: '',
  juegosRival: '',
  tiebreakNuestros: '',
  tiebreakRival: '',
};

/** Identificador de un partido dentro de su confrontación: «masculino-2». */
export function clavePartido(partido: { tipo: TipoPartido; numero: number }): string {
  return `${partido.tipo}-${partido.numero}`;
}

/** Los WO y los partidos por jugar no tienen sets. */
export function resultadoLlevaSets(resultado: TipoResultadoPartido | null): boolean {
  return resultado === 'normal' || resultado === 'abandono' || resultado === 'suspendido';
}

/** «Sergio y Jorge», «Rocio y pareja sin asignar» o «Pareja sin asignar». */
export function describirPareja(
  reves: JugadorAlineado | null,
  drive: JugadorAlineado | null,
): string {
  const nombres = [reves, drive].flatMap((jugador) => (jugador ? [jugador.nombreMostrar] : []));
  if (nombres.length === 2) {
    return `${nombres[0]} y ${nombres[1]}`;
  }
  return nombres.length === 1 ? `${nombres[0]} y pareja sin asignar` : 'Pareja sin asignar';
}

/** Las tres filas del formulario a partir de los sets guardados. */
export function setsFormularioDesde(sets: readonly SetPartido[]): SetFormulario[] {
  return Array.from({ length: SETS_POR_PARTIDO }, (_, indice) => {
    const set = sets[indice];
    if (!set) {
      return SET_VACIO;
    }
    return {
      juegosNuestros: String(set.juegosNuestros),
      juegosRival: String(set.juegosRival),
      tiebreakNuestros: set.tiebreakNuestros === null ? '' : String(set.tiebreakNuestros),
      tiebreakRival: set.tiebreakRival === null ? '' : String(set.tiebreakRival),
    };
  });
}

/**
 * Convierte lo escrito en el formulario en el marcador que se guarda:
 * - Las filas vacías del final no cuentan; una vacía entre dos rellenas queda como set sin
 *   juegos para que la validación la señale.
 * - El tie-break solo se tiene en cuenta si el set acaba 7-6.
 * - Quién ganó solo se envía en los abandonos.
 */
export function construirMarcador(
  resultado: TipoResultadoPartido | null,
  ganado: boolean | null,
  sets: readonly SetFormulario[],
): MarcadorPartido {
  const filas = resultadoLlevaSets(resultado) ? sinFilasVaciasAlFinal(sets) : [];
  return {
    resultado,
    ganado: resultado === 'abandono' ? ganado : null,
    sets: filas.map(convertirSet),
  };
}

/** `true` si los dos marcadores guardarían lo mismo. */
export function marcadoresIguales(a: MarcadorPartido, b: MarcadorPartido): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function sinFilasVaciasAlFinal(sets: readonly SetFormulario[]): readonly SetFormulario[] {
  let longitud = sets.length;
  while (longitud > 0 && filaVacia(sets[longitud - 1])) {
    longitud--;
  }
  return sets.slice(0, longitud);
}

function filaVacia(set: SetFormulario): boolean {
  return Object.values(set).every((valor) => valor.trim() === '');
}

function convertirSet(set: SetFormulario): SetPartido {
  const juegosNuestros = aNumero(set.juegosNuestros);
  const juegosRival = aNumero(set.juegosRival);
  const conTiebreak = setConTiebreak(juegosNuestros, juegosRival);
  return {
    juegosNuestros,
    juegosRival,
    tiebreakNuestros: conTiebreak ? aNumeroONulo(set.tiebreakNuestros) : null,
    tiebreakRival: conTiebreak ? aNumeroONulo(set.tiebreakRival) : null,
  };
}

/** Un campo vacío da `NaN`, que la validación señala como «faltan los juegos». */
function aNumero(texto: string): number {
  return texto.trim() === '' ? Number.NaN : Number(texto);
}

function aNumeroONulo(texto: string): number | null {
  return texto.trim() === '' ? null : Number(texto);
}
