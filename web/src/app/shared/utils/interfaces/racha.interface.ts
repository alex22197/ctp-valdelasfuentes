/** Lo último que viene pasando: cuántos partidos seguidos se han ganado o perdido. */
export interface Racha {
  readonly tipo: 'victorias' | 'derrotas';
  readonly largo: number;
}
