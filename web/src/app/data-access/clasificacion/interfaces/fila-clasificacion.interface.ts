import type { EquipoResumen } from '@data-access/equipos/interfaces/equipo-resumen.interface';

/** Una fila de la clasificación oficial de un grupo, tal como la publica la liga. */
export interface FilaClasificacion {
  readonly posicion: number | null;
  readonly equipo: EquipoResumen;
  readonly puntos: number;
  readonly ganados: number;
  readonly empatados: number;
  readonly perdidos: number;
  /** Momento en que el scraper la actualizó por última vez (ISO 8601). */
  readonly actualizadaEn: string | null;
}
