/** Algo de la alineación que incumple la normativa (error) o conviene revisar (aviso). */
export interface ProblemaAlineacion {
  readonly gravedad: 'error' | 'aviso';
  /** Pista a la que se refiere («masculino-2»), o `null` si afecta a toda la alineación. */
  readonly clave: string | null;
  readonly mensaje: string;
}
