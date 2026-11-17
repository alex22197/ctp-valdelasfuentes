import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import type { GruposGestionPlantilla } from '../interfaces/grupos-gestion-plantilla.interface';

/**
 * Reparte la plantilla para gestionarla: chicos y chicas de la plantilla habitual, los
 * comodines aparte y, al final, quienes se han dado de baja. Cada grupo por orden alfabético.
 */
export function agruparGestionPlantilla(
  jugadores: readonly JugadorGestion[],
): GruposGestionPlantilla {
  const ordenados = [...jugadores].sort((a, b) =>
    a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'),
  );
  const activos = ordenados.filter((jugador) => jugador.baja === null);
  return {
    chicos: activos.filter((jugador) => !jugador.comodin && jugador.sexo === 'masculino'),
    chicas: activos.filter((jugador) => !jugador.comodin && jugador.sexo === 'femenino'),
    comodines: activos.filter((jugador) => jugador.comodin),
    bajas: ordenados.filter((jugador) => jugador.baja !== null),
  };
}
