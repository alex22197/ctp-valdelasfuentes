/** Lo que hay escrito en el formulario de una jornada, tal cual llega de los campos. */
export interface FormularioJornada {
  /** AAAA-MM-DD, o vacío. */
  readonly dia: string;
  /** HH:MM en hora de Madrid, o vacío. */
  readonly hora: string;
  readonly sede: string;
  /** «1» a «6», o vacío. */
  readonly pistas: string;
}
