import type { EquipoResumen } from '@data-access/equipos/interfaces/equipo-resumen.interface';
import type { CondicionEquipo } from './condicion-equipo.type';
import type { EstadoConfrontacion } from './estado-confrontacion.type';
import type { MarcadorConfrontacion } from './marcador-confrontacion.interface';

/** Una jornada de nuestro equipo contra un rival, vista desde nuestro lado. */
export interface ConfrontacionNuestroEquipo {
  readonly id: string;
  readonly jornada: number | null;
  readonly local: EquipoResumen;
  readonly visitante: EquipoResumen;
  readonly rival: EquipoResumen;
  readonly condicion: CondicionEquipo;
  readonly estado: EstadoConfrontacion;
  /** Fin de semana del calendario oficial (AAAA-MM-DD). */
  readonly fechaPrevista: string | null;
  /** Día y hora reales del partido (ISO 8601). */
  readonly fechaHora: string | null;
  readonly sede: string | null;
  readonly numeroPistas: number | null;
  /** `null` mientras no haya resultado. */
  readonly marcador: MarcadorConfrontacion | null;
}
