import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';
import type { EstadoPorJugar } from './interfaces/estado-por-jugar.type';
import { ESTADOS_POR_JUGAR } from './proxima-confrontacion';

/**
 * Si la jornada sigue por jugar (programada, aplazada o suspendida). Una terminada, jugada o
 * perdida por no comparecencia, ya no se convoca ni cambia de fecha.
 */
export function estaPorJugar(estado: EstadoConfrontacion): estado is EstadoPorJugar {
  return ESTADOS_POR_JUGAR.includes(estado);
}

/** Lo que se enseña junto a la fecha cuando una jornada no sigue su curso normal. */
export function etiquetaEstadoJornada(estado: EstadoConfrontacion): string | null {
  switch (estado) {
    case 'aplazada':
      return 'Aplazada';
    case 'suspendida':
      return 'Suspendida';
    case 'no_comparecencia':
      return 'No comparecencia';
    default:
      return null;
  }
}
