import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoConfrontacion } from './interfaces/estado-confrontacion.type';

const ESTADOS_PENDIENTES: readonly EstadoConfrontacion[] = ['programada', 'aplazada', 'suspendida'];

/** Primera confrontación del calendario que todavía no se ha jugado. */
export function elegirProximaConfrontacion(
  calendario: readonly ConfrontacionNuestroEquipo[],
): ConfrontacionNuestroEquipo | null {
  return (
    calendario.find((confrontacion) => ESTADOS_PENDIENTES.includes(confrontacion.estado)) ?? null
  );
}
