import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { GrupoCuadricula } from '../../interfaces/grupo-cuadricula.interface';
import { SIMBOLO_ESTADO } from '../../utils/simbolo-estado';

/**
 * Una jornada en pequeño: un recuadro por partido (✓, ✕ o –) y su categoría debajo. Es solo
 * visual: quien la usa da el resumen en texto.
 */
@Component({
  selector: 'ctp-tira-jornada',
  templateUrl: './tira-jornada.component.html',
  styleUrl: './tira-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class TiraJornadaComponent {
  readonly grupos = input.required<readonly GrupoCuadricula[]>();

  protected readonly simbolo = SIMBOLO_ESTADO;
}
