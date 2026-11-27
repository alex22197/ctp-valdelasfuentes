import type { EstadoPorJugar } from '@data-access/confrontaciones/interfaces/estado-por-jugar.type';

/** Un cambio de estado que se ofrece en la tarjeta de una jornada por jugar. */
export interface OpcionEstadoJornada {
  readonly destino: EstadoPorJugar;
  /** Texto del botón, en voz activa: «Aplazar», «Quitar el aplazamiento». */
  readonly texto: string;
  /** Aplazar o suspender borran la fecha, así que se confirman antes; volver atrás no. */
  readonly confirmacion: { readonly pregunta: string; readonly boton: string } | null;
}
