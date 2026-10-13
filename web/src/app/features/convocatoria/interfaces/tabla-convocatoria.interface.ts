import type { FilaTablaConvocatoria } from './fila-tabla-convocatoria.interface';

/** Lo que se dibuja en la imagen de la convocatoria para WhatsApp. */
export interface TablaConvocatoria {
  /** «vs SOTO TORREJÓN SÁBADO 12:00 LOS 6 A LA VEZ». */
  readonly titulo: string;
  readonly filas: readonly FilaTablaConvocatoria[];
}
