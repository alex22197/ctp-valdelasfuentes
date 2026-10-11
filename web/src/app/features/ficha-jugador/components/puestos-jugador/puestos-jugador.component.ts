import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { BalancePuesto } from '@data-access/estadisticas/interfaces/balance-puesto.interface';
import { nombrePista } from '@shared/utils/etiquetas-partido';
import { BarraVictoriasComponent } from '../barra-victorias/barra-victorias.component';

/** Partidos y victorias en cada número de pareja: masculino 1, 2, 3, mixto… */
@Component({
  selector: 'ctp-puestos-jugador',
  imports: [BarraVictoriasComponent],
  templateUrl: './puestos-jugador.component.html',
  styleUrl: './puestos-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuestosJugadorComponent {
  readonly puestos = input.required<readonly BalancePuesto[]>();

  protected readonly nombrePista = nombrePista;
}
