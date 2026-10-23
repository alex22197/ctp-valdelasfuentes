/** Alguien que ha entrado con Google y aún no tiene papel ni ha sido descartado. */
export interface CuentaPendiente {
  readonly email: string;
  /** El nombre de su cuenta de Google, si lo tiene. */
  readonly nombre: string | null;
  /** Cuándo entró por primera vez, en ISO. */
  readonly alta: string;
}
