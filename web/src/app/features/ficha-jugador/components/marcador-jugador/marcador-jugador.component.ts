import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';

/** Marcador grande con los partidos, los ganados y los sets de un jugador. */
@Component({
  selector: 'ctp-marcador-jugador',
  templateUrl: './marcador-jugador.component.html',
  styleUrl: './marcador-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcadorJugadorComponent {
  readonly resumen = input.required<ResumenJugador>();
}
