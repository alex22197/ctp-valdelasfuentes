import type { Tables } from '@core/supabase/interfaces/database.types';

export type FilaNombreCompleto = Pick<Tables<'jugador_privado'>, 'jugador_id' | 'nombre_completo'>;

/** Nombre completo de cada jugador que lo tiene, por su id; los vacíos se descartan. */
export function mapearNombresCompletos(
  filas: readonly FilaNombreCompleto[],
): ReadonlyMap<string, string> {
  return new Map(
    filas.flatMap((fila) => {
      const nombre = fila.nombre_completo?.trim();
      return nombre ? [[fila.jugador_id, nombre] as const] : [];
    }),
  );
}
