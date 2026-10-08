import type { Enums } from '@core/supabase/interfaces/database.types';

/** Sexo de un jugador: decide en qué partidos puede jugar (masculino, femenino o mixto). */
export type Sexo = Enums<'sexo'>;
