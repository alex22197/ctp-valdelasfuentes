/** Motivo por el que un marcador no cumple la normativa. */
export interface ErrorMarcador {
  /** Set al que se refiere (1, 2 o 3), o `null` si afecta a todo el partido. */
  readonly numeroSet: number | null;
  readonly mensaje: string;
}
