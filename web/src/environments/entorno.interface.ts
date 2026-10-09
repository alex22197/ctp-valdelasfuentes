/** Forma de la configuración de cada entorno (desarrollo y producción). */
export interface Entorno {
  readonly produccion: boolean;
  readonly supabase: {
    readonly url: string;
    readonly publishableKey: string;
  };
}
