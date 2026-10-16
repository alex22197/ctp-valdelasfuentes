/** La elección que se guarda en el navegador, con el día en que se tomó. */
export interface ConsentimientoGuardado {
  readonly estado: 'aceptado' | 'rechazado';
  /** Fecha ISO de la elección. */
  readonly fecha: string;
}
