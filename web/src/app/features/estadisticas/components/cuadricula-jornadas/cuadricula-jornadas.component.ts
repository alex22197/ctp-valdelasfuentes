import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';

/**
 * Jornada a jornada: seis casillas por jornada, verde oscuro si se ganó, naranja si se
 * perdió y discontinua si está pendiente, con el marcador y los puntos debajo.
 */
@Component({
  selector: 'ctp-cuadricula-jornadas',
  templateUrl: './cuadricula-jornadas.component.html',
  styleUrl: './cuadricula-jornadas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadriculaJornadasComponent {
  readonly filas = input.required<readonly FilaCuadricula[]>();

  protected readonly textoEstado = { ganado: 'ganado', perdido: 'perdido', pendiente: 'pendiente' };
}
