import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TipoMensajeEstado } from './interfaces/tipo-mensaje-estado.type';

/** Mensaje uniforme para secciones que están cargando, han fallado o no tienen datos. */
@Component({
  selector: 'ctp-mensaje-estado',
  templateUrl: './mensaje-estado.component.html',
  styleUrl: './mensaje-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeEstadoComponent {
  readonly tipo = input.required<TipoMensajeEstado>();
  readonly texto = input.required<string>();
}
