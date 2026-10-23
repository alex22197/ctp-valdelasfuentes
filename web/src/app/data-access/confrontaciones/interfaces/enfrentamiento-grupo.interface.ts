import type { EquipoResumen } from '@data-access/equipos/interfaces/equipo-resumen.interface';
import type { EstadoConfrontacion } from './estado-confrontacion.type';
import type { MarcadorEnfrentamiento } from './marcador-enfrentamiento.interface';

/** Un enfrentamiento cualquiera del grupo, sea o no nuestro, visto desde la liga. */
export interface EnfrentamientoGrupo {
  readonly id: string;
  /** `null` en las eliminatorias. */
  readonly jornada: number | null;
  readonly local: EquipoResumen;
  readonly visitante: EquipoResumen;
  readonly estado: EstadoConfrontacion;
  /** `null` mientras no hay resultado. */
  readonly marcador: MarcadorEnfrentamiento | null;
}
