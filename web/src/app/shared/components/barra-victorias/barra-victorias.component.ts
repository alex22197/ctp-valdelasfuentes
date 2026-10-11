import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { BalancePartidos } from '@data-access/estadisticas/interfaces/balance-partidos.interface';

/** Barra con el porcentaje de victorias y el texto «2 de 3 ganados». */
@Component({
  selector: 'ctp-barra-victorias',
  templateUrl: './barra-victorias.component.html',
  styleUrl: './barra-victorias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarraVictoriasComponent {
  readonly balance = input.required<BalancePartidos>();
}
