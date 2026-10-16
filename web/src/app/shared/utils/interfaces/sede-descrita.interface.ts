/** La sede lista para enseñar: un nombre y, si se guardó un enlace de mapa, su dirección. */
export interface SedeDescrita {
  /** El nombre del sitio o el texto tal cual; `null` si es un enlace que no lo trae. */
  readonly nombre: string | null;
  readonly direccion: string | null;
  /** Enlace https al mapa, o `null` si la sede es un texto. */
  readonly enlace: string | null;
}
