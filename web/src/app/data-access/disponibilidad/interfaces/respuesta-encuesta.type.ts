import type { Enums } from '@core/supabase/interfaces/database.types';

/** Respuesta a la encuesta de WhatsApp. Sin respuesta (`null`) = no ha contestado. */
export type RespuestaEncuesta = Enums<'respuesta_encuesta'>;
