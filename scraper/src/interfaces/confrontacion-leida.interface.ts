/** Una fila de la tabla de una jornada en la web de la liga. Sin jugar, la liga pone 0-0. */
export interface ConfrontacionLeida {
  readonly local: string;
  readonly visitante: string;
  readonly partidosLocal: number;
  readonly partidosVisitante: number;
}
