/**
 * Un set tal como se escribe en el formulario: textos, vacíos mientras no se rellenan. Solo
 * los juegos: los puntos del tie-break no se apuntan (un 7-6 ya dice quién lo ganó).
 */
export interface SetFormulario {
  readonly juegosNuestros: string;
  readonly juegosRival: string;
}
