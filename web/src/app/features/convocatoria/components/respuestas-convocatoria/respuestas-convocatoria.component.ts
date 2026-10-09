import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { GrupoRespuestas } from '../../interfaces/grupo-respuestas.interface';

/**
 * Las respuestas a la encuesta en cuatro grupos con su contador: convocados, pueden sin
 * convocar, no pueden y sin responder. Cada grupo se distingue también por la forma del
 * borde, no solo por el color.
 */
@Component({
  selector: 'ctp-respuestas-convocatoria',
  templateUrl: './respuestas-convocatoria.component.html',
  styleUrl: './respuestas-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RespuestasConvocatoriaComponent {
  readonly grupos = input.required<readonly GrupoRespuestas[]>();
}
