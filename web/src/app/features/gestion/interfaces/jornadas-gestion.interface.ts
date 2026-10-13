import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';

/** Las jornadas de la fase ordenadas por lo que le toca hacer a un gestor. */
export interface JornadasGestion {
  /** La siguiente por jugar (la de hoy incluida): su convocatoria es lo urgente. */
  readonly proxima: ConfrontacionNuestroEquipo | null;
  /** Ya se jugaron (o se juegan hoy) y les faltan resultados. */
  readonly sinResultados: readonly ConfrontacionNuestroEquipo[];
}
