import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import { BarraVictoriasComponent } from '@shared/components/barra-victorias/barra-victorias.component';

/** Cuántas parejas se enseñan. */
const LIMITE = 5;

const NOMBRE_TIPO = { masculino: 'Masculino', femenino: 'Femenino', mixto: 'Mixto' } as const;

/** Las parejas que más han jugado juntas, con su barra de victorias. */
@Component({
  selector: 'ctp-parejas-repetidas',
  imports: [BarraVictoriasComponent],
  templateUrl: './parejas-repetidas.component.html',
  styleUrl: './parejas-repetidas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParejasRepetidasComponent {
  /** Llegan ordenadas de más a menos partidos juntos. */
  readonly parejas = input.required<readonly BalancePareja[]>();

  protected readonly primeras = computed(() => this.parejas().slice(0, LIMITE));
  protected readonly nombreTipo = NOMBRE_TIPO;
}
