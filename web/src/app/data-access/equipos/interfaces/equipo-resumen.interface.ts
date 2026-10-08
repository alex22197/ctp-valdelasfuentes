/** Datos mínimos de un equipo para mostrarlo en listas, tablas y marcadores. */
export interface EquipoResumen {
  readonly id: string;
  readonly nombre: string;
  readonly esNuestro: boolean;
}
