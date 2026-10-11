import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BalanceCompanero } from '@data-access/estadisticas/interfaces/balance-companero.interface';
import { BarraVictoriasComponent } from '../barra-victorias/barra-victorias.component';

/** Con quién ha jugado, de más a menos partidos, con su porcentaje de victorias. */
@Component({
  selector: 'ctp-companeros-jugador',
  imports: [RouterLink, BarraVictoriasComponent],
  templateUrl: './companeros-jugador.component.html',
  styleUrl: './companeros-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanerosJugadorComponent {
  readonly companeros = input.required<readonly BalanceCompanero[]>();
  /** Los comodines no tienen ficha pública: solo se enlazan para los gestores. */
  readonly enlazarComodines = input(false);
}
