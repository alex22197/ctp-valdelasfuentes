/** Una fase de nuestra base de datos con página en la web de la liga. */
export interface FaseALeer {
  readonly id: string;
  readonly nombre: string;
  /** `apertura` y `clausura` son grupos con clasificación; el resto, eliminatorias. */
  readonly tipo: string;
  readonly urlGrupo: string;
  /** AAAA-MM-DD o `null`. */
  readonly inicio: string | null;
  readonly fin: string | null;
}
