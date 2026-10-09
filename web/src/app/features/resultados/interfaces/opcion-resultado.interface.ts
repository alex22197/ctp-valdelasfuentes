import type { TipoResultadoPartido } from '@data-access/resultados/interfaces/tipo-resultado-partido.type';

/** Una de las formas en que puede terminar un partido, con su texto para el formulario. */
export interface OpcionResultado {
  readonly valor: TipoResultadoPartido | null;
  readonly etiqueta: string;
}
