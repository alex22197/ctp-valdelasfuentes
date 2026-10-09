import type { Enums } from '@core/supabase/interfaces/database.types';

/** Cómo terminó un partido. Un partido sin resultado (`null`) está por jugar. */
export type TipoResultadoPartido = Enums<'resultado_partido'>;
