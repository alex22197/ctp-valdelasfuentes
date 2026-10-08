import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { RecuentoEncuesta } from '../../interfaces/recuento-encuesta.interface';

/** Cuántos pueden, no pueden y no han contestado. Se queda fijo arriba al bajar. */
@Component({
  selector: 'ctp-recuento-encuesta',
  templateUrl: './recuento-encuesta.component.html',
  styleUrl: './recuento-encuesta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecuentoEncuestaComponent {
  readonly recuento = input.required<RecuentoEncuesta>();
}
