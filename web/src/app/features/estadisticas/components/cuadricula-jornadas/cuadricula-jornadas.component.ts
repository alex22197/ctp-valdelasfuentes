import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';
import { FichaJornadaComponent } from '../ficha-jornada/ficha-jornada.component';

/** Jornada a jornada: una ficha cerrada por jornada, que se abre para ver cada partido. */
@Component({
  selector: 'ctp-cuadricula-jornadas',
  imports: [FichaJornadaComponent],
  templateUrl: './cuadricula-jornadas.component.html',
  styleUrl: './cuadricula-jornadas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadriculaJornadasComponent {
  readonly filas = input.required<readonly FilaCuadricula[]>();
}
