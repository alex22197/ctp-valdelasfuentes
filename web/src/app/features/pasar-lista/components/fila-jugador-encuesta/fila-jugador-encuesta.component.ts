import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { RespuestaEncuesta } from '@data-access/disponibilidad/interfaces/respuesta-encuesta.type';
import { OPCIONES_RESPUESTA } from '../../utils/lista-encuesta';

/**
 * Un jugador con sus tres botones (Sí, No y ?). Son radios reales, así que se manejan
 * también con el teclado y los lectores de pantalla los anuncian como un grupo.
 */
@Component({
  selector: 'ctp-fila-jugador-encuesta',
  templateUrl: './fila-jugador-encuesta.component.html',
  styleUrl: './fila-jugador-encuesta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilaJugadorEncuestaComponent {
  readonly jugador = input.required<JugadorEncuesta>();
  /** Mientras se guarda su respuesta, los botones se bloquean. */
  readonly guardando = input(false);
  readonly error = input<string | null>(null);
  readonly responder = output<RespuestaEncuesta | null>();

  protected readonly opciones = OPCIONES_RESPUESTA;
  protected readonly idNombre = computed(() => `jugador-${this.jugador().id}`);
  protected readonly idError = computed(() => `error-${this.jugador().id}`);
}
