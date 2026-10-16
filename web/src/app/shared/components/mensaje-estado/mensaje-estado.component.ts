import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { EsqueletoComponent } from '../esqueleto/esqueleto.component';
import type { FormaEsqueleto } from '../esqueleto/interfaces/forma-esqueleto.type';
import type { TipoMensajeEstado } from './interfaces/tipo-mensaje-estado.type';

/**
 * Mensaje uniforme para secciones que están cargando, han fallado o no tienen datos.
 * Mientras carga se ve el esqueleto de lo que va a salir (`esqueleto`); el texto queda para
 * los lectores de pantalla.
 */
@Component({
  selector: 'ctp-mensaje-estado',
  imports: [EsqueletoComponent],
  templateUrl: './mensaje-estado.component.html',
  styleUrl: './mensaje-estado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MensajeEstadoComponent {
  readonly tipo = input.required<TipoMensajeEstado>();
  readonly texto = input.required<string>();
  readonly esqueleto = input<FormaEsqueleto>('tarjetas');
}
