import type { ConfrontacionConocida } from './confrontacion-conocida.interface.ts';
import type { EquipoConocido } from './equipo-conocido.interface.ts';
import type { MarcadorNuestro } from './marcador-nuestro.interface.ts';

/** Lo que ya sabe nuestra base de datos de una fase, para decidir qué cambia. */
export interface ContextoFase {
  readonly faseId: string;
  readonly faseNombre: string;
  /** Todos los equipos, incluidos los que se acaban de crear. */
  readonly equipos: readonly EquipoConocido[];
  readonly confrontaciones: readonly ConfrontacionConocida[];
  readonly marcadores: readonly MarcadorNuestro[];
}
