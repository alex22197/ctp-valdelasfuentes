/** Forma de la configuración de cada entorno (desarrollo y producción). */
export interface Entorno {
  readonly produccion: boolean;
  readonly supabase: {
    readonly url: string;
    readonly publishableKey: string;
  };
  /** ID de medición de Google Analytics (`G-…`); `null` para no medir nada. */
  readonly idAnalitica: string | null;
}
