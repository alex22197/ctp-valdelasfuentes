import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import type { ConfrontacionNuestroEquipo } from './confrontacion-nuestro-equipo.interface';

/** Las confrontaciones de nuestro equipo en una fase, en orden de calendario. */
export interface CalendarioDeFase {
  readonly fase: Fase;
  readonly confrontaciones: readonly ConfrontacionNuestroEquipo[];
}
