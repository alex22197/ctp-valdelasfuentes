import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { JugadorResaltado } from '../../interfaces/jugador-resaltado.interface';

/**
 * Aviso fijo sobre la barra de navegación con el jugador resaltado en las gráficas, para
 * abrir su ficha o dejar de resaltarlo.
 */
@Component({
  selector: 'ctp-barra-resaltado',
  imports: [RouterLink],
  templateUrl: './barra-resaltado.component.html',
  styleUrl: './barra-resaltado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraResaltadoComponent {
  readonly jugador = input.required<JugadorResaltado | null>();
  /** Los comodines solo ofrecen ficha a los gestores. */
  readonly enlazarComodines = input(false);
  readonly quitar = output();
}
