import type { FilaClasificacionLeida } from './fila-clasificacion-leida.interface.ts';
import type { JornadaLeida } from './jornada-leida.interface.ts';

/** Lo que se saca de la página de un grupo: la fase que enseña, sus jornadas y la clasificación. */
export interface PaginaGrupo {
  /** «Apertura», «Clausura»… o `null` si la página no lo dice. */
  readonly fase: string | null;
  readonly jornadas: readonly JornadaLeida[];
  readonly clasificacion: readonly FilaClasificacionLeida[];
}
