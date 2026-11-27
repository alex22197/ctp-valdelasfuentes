import type { EnfrentamientoGrupo } from './enfrentamiento-grupo.interface';

/** Los enfrentamientos de una jornada del grupo, el nuestro primero. */
export interface JornadaGrupo {
  /** «Jornada 2», o «Eliminatoria» si no tiene número. */
  readonly titulo: string;
  readonly enfrentamientos: readonly EnfrentamientoGrupo[];
}
