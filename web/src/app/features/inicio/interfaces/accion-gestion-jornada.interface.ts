/** Un enlace de gestión en una fila del calendario: adónde lleva y cómo se llama. */
export interface AccionGestionJornada {
  readonly texto: string;
  /** Ruta de la pantalla: `['/convocatoria', id]`. */
  readonly ruta: readonly string[];
}
