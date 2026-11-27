import type { ConfrontacionNuestroEquipo } from './confrontacion-nuestro-equipo.interface';

/** Las jornadas de una fase separadas en lo que viene y lo que ya pasó. */
export interface JornadasRepartidas {
  /** Por jugar y sin pasar (la de hoy incluida), la más cercana primero; sin fecha, al final. */
  readonly porJugar: readonly ConfrontacionNuestroEquipo[];
  /** Terminadas, o por jugar con el día ya pasado (les falta el resultado): la más reciente primero. */
  readonly disputadas: readonly ConfrontacionNuestroEquipo[];
}
