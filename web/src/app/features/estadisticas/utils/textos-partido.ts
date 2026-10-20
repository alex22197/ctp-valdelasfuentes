import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { SetPartido } from '@data-access/resultados/interfaces/set-partido.interface';
import type { TipoResultadoPartido } from '@data-access/resultados/interfaces/tipo-resultado-partido.type';

/** «Pablo y Iván» (revés y drive); un solo nombre si falta el otro; `null` si no hay nadie. */
export function textoPareja(
  reves: JugadorAlineado | null,
  drive: JugadorAlineado | null,
): string | null {
  const nombres = [reves, drive].flatMap((jugador) => (jugador ? [jugador.nombreMostrar] : []));
  return nombres.length > 0 ? nombres.join(' y ') : null;
}

/** Un set desde nuestro lado: «6-3». */
export function textoSet(set: SetPartido): string {
  return `${set.juegosNuestros}-${set.juegosRival}`;
}

const NOTAS: Partial<Record<TipoResultadoPartido, string>> = {
  wo_favor: 'WO',
  wo_contra: 'WO',
  abandono: 'Abandono',
  suspendido: 'Suspendido',
};

/** Lo que hay que aclarar de un resultado que no se explica solo con los sets. */
export function notaResultado(resultado: TipoResultadoPartido | null): string | null {
  return resultado ? (NOTAS[resultado] ?? null) : null;
}
