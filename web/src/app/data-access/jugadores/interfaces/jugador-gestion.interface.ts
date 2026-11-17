import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { Sexo } from './sexo.type';

/** Un jugador tal como lo ve un gestor: con su nombre completo y su situación en la plantilla. */
export interface JugadorGestion {
  readonly id: string;
  readonly nombreMostrar: string;
  /** Privado: solo lo leen los gestores; sale en la imagen de la convocatoria. */
  readonly nombreCompleto: string | null;
  readonly sexo: Sexo;
  readonly ladoPreferido: Lado | null;
  readonly comodin: boolean;
  /** `null`: sin comprobar en la lista oficial de la liga. */
  readonly inscritoOficial: boolean | null;
  /** AAAA-MM-DD, o `null` si sigue en la plantilla. */
  readonly baja: string | null;
}
