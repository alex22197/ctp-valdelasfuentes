import type { Database } from '../../../web/src/app/core/supabase/interfaces/database.types.ts';

/** Una confrontación de la fase que ya está en nuestra base de datos. */
export interface ConfrontacionConocida {
  readonly id: string;
  readonly jornada: number | null;
  readonly localId: string;
  readonly visitanteId: string;
  readonly partidosLocal: number | null;
  readonly partidosVisitante: number | null;
  readonly estado: Database['public']['Enums']['estado_confrontacion'];
}
