import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';
import type { FaseConEstado } from './fase-con-estado.interface';
import type { JornadaGrupo } from './jornada-grupo.interface';

/** La clasificación de una fase de liga con las jornadas de su grupo, lista para enseñar. */
export interface BloqueClasificacion extends FaseConEstado {
  readonly filas: readonly FilaClasificacion[];
  readonly jornadas: readonly JornadaGrupo[];
  /** Cuándo la actualizó la liga, o que aún no la ha publicado. */
  readonly nota: string;
}
