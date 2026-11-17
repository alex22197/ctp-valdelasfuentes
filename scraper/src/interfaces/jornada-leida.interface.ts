import type { ConfrontacionLeida } from './confrontacion-leida.interface.ts';

/** Una jornada de la página del grupo: «Jornada N» y su tabla de confrontaciones. */
export interface JornadaLeida {
  readonly numero: number;
  readonly confrontaciones: readonly ConfrontacionLeida[];
}
