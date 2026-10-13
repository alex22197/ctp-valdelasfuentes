import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';

/** Una pareja en la imagen de la convocatoria: «PAREJA 1 MASC.», revés y drive. */
export interface FilaTablaConvocatoria {
  readonly etiqueta: string;
  /** Decide el color de la etiqueta: naranja, amarillo o violeta. */
  readonly tipo: TipoPartido;
  readonly reves: string;
  readonly drive: string;
}
