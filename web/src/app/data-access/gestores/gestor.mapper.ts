import type { Database } from '@core/supabase/interfaces/database.types';
import type { Gestor } from './interfaces/gestor.interface';

export type FilaGestor = Database['public']['Functions']['listar_gestores']['Returns'][number];

export function mapearGestor(fila: FilaGestor): Gestor {
  return {
    email: fila.email,
    // Los tipos generados no saben que el nombre puede faltar: viene de la cuenta de Google.
    nombre: fila.nombre?.trim() || null,
    rol: fila.rol,
    pendiente: fila.pendiente,
    esTu: fila.es_tu,
  };
}
