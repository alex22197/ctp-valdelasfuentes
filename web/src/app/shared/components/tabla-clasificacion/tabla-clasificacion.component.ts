import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FilaClasificacion } from '@data-access/clasificacion/interfaces/fila-clasificacion.interface';

/** Tabla de clasificación de un grupo. Resalta la fila de nuestro equipo. */
@Component({
  selector: 'ctp-tabla-clasificacion',
  templateUrl: './tabla-clasificacion.component.html',
  styleUrl: './tabla-clasificacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablaClasificacionComponent {
  readonly filas = input.required<readonly FilaClasificacion[]>();
}
