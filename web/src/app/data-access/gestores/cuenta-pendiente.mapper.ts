import type { Database } from '@core/supabase/interfaces/database.types';
import type { CuentaPendiente } from './interfaces/cuenta-pendiente.interface';

export type FilaCuentaPendiente =
  Database['public']['Functions']['listar_cuentas_pendientes']['Returns'][number];

export function mapearCuentaPendiente(fila: FilaCuentaPendiente): CuentaPendiente {
  return {
    email: fila.email,
    // Los tipos generados no saben que el nombre puede faltar: viene de la cuenta de Google.
    nombre: fila.nombre?.trim() || null,
    alta: fila.alta,
  };
}
