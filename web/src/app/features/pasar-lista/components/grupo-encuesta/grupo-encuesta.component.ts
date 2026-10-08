import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { GrupoEncuesta } from '../../interfaces/grupo-encuesta.interface';
import type { RespuestaJugador } from '../../interfaces/respuesta-jugador.interface';
import { FilaJugadorEncuestaComponent } from '../fila-jugador-encuesta/fila-jugador-encuesta.component';

/** Chicos o chicas, con «X de N pueden» y una fila por jugador. */
@Component({
  selector: 'ctp-grupo-encuesta',
  imports: [FilaJugadorEncuestaComponent],
  templateUrl: './grupo-encuesta.component.html',
  styleUrl: './grupo-encuesta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrupoEncuestaComponent {
  readonly grupo = input.required<GrupoEncuesta>();
  readonly guardando = input<ReadonlySet<string>>(new Set());
  readonly errores = input<ReadonlyMap<string, string>>(new Map());
  readonly responder = output<RespuestaJugador>();

  protected readonly idTitulo = computed(() => `grupo-${this.grupo().sexo}`);
}
