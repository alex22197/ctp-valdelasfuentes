import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { CasillaJornada } from './casilla-jornada.interface';

/** Los partidos de una categoría en una jornada: los masculinos, los femeninos o el mixto. */
export interface GrupoCuadricula {
  readonly tipo: TipoPartido;
  /** «Masculino», «Femenino» o «Mixto». */
  readonly nombre: string;
  readonly casillas: readonly CasillaJornada[];
}
