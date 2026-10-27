import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import type { Racha } from '@shared/utils/interfaces/racha.interface';
import { describirRacha } from '@shared/utils/rachas';

/** Marcador grande con los partidos, los ganados y los sets de un jugador, y su racha. */
@Component({
  selector: 'ctp-marcador-jugador',
  templateUrl: './marcador-jugador.component.html',
  styleUrl: './marcador-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcadorJugadorComponent {
  readonly resumen = input.required<ResumenJugador>();
  /** Solo se enseña a partir de dos partidos seguidos iguales. */
  readonly racha = input<Racha | null>(null);

  protected readonly describirRacha = describirRacha;
}
