import type { EstadoConfrontacion } from './estado-confrontacion.type';

/** Los estados de una jornada que aún no se ha jugado: los únicos que elige un gestor. */
export type EstadoPorJugar = Extract<EstadoConfrontacion, 'programada' | 'aplazada' | 'suspendida'>;
