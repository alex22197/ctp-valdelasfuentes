/** Cuántos pueden, cuántos no y cuántos no han contestado. */
export interface RecuentoEncuesta {
  readonly pueden: number;
  readonly noPueden: number;
  readonly sinResponder: number;
  readonly total: number;
}
