import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LibraCorriendoComponent } from '../libra-corriendo/libra-corriendo.component';
import type { TipoMensajeEstado } from './interfaces/tipo-mensaje-estado.type';

/**
 * Mensaje uniforme para secciones que están cargando, han fallado o no tienen datos.
 * Mientras carga, Libra persigue la pelota encima del texto.
 */
@Component({
  selector: 'ctp-mensaje-estado',
  imports: [LibraCorriendoComponent],
  templateUrl: './mensaje-estado.component.html',
  styleUrl: './mensaje-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeEstadoComponent {
  readonly tipo = input.required<TipoMensajeEstado>();
  readonly texto = input.required<string>();
}
