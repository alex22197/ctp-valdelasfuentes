import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { CuentaPendiente } from '@data-access/gestores/interfaces/cuenta-pendiente.interface';
import { describirDia } from '@shared/utils/fechas';
import type { DecisionCuenta } from '../../interfaces/decision-cuenta.interface';

/**
 * Quien ha entrado con Google y espera a que el administrador decida: hacerlo capitán (lo
 * habitual) o administrador, o descartarlo. Hacer administrador pide confirmación, porque da
 * acceso a todo.
 */
@Component({
  selector: 'ctp-cuentas-nuevas',
  templateUrl: './cuentas-nuevas.component.html',
  styleUrl: './cuentas-nuevas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuentasNuevasComponent {
  readonly cuentas = input.required<readonly CuentaPendiente[]>();
  readonly ocupado = input(false);
  readonly aceptar = output<DecisionCuenta>();
  readonly descartar = output<CuentaPendiente>();

  /** Correo al que se está confirmando hacer administrador. */
  protected readonly confirmandoAdmin = signal<string | null>(null);
  protected readonly describirDia = describirDia;

  protected hacerAdmin(cuenta: CuentaPendiente): void {
    this.confirmandoAdmin.set(null);
    this.aceptar.emit({ cuenta, rol: 'admin' });
  }
}
