/** Una fila de la clasificación de la web de la liga, con sus columnas tal cual. */
export interface FilaClasificacionLeida {
  readonly posicion: number;
  readonly equipo: string;
  readonly puntos: number;
  readonly ganados: number;
  readonly empatados: number;
  readonly perdidos: number;
  readonly partidosFavor: number;
  readonly partidosContra: number;
}
