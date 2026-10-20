import type { EstadoCasilla } from '../interfaces/estado-casilla.type';

/** El símbolo de cada resultado, para que no dependa solo del color. */
export const SIMBOLO_ESTADO: Readonly<Record<EstadoCasilla, string>> = {
  ganado: '✓',
  perdido: '✕',
  pendiente: '–',
};
