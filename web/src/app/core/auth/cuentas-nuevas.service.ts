import { Injectable, computed, inject, resource } from '@angular/core';
import { GestoresService } from '@data-access/gestores/gestores.service';
import { AuthService } from './auth.service';

/**
 * Las cuentas que han entrado con Google y esperan a que el administrador decida. Lo comparten
 * el aviso de la cabecera y la página de gestión, para que el número cambie al decidir. Solo
 * se piden si la sesión es de administrador: a cualquier otro la base de datos se las negaría.
 */
@Injectable({ providedIn: 'root' })
export class CuentasNuevasService {
  private readonly auth = inject(AuthService);
  private readonly gestores = inject(GestoresService);

  readonly cuentas = resource({
    params: () => (this.auth.esAdmin() ? true : undefined),
    loader: () => this.gestores.obtenerCuentasPendientes(),
  });

  readonly lista = computed(() => (this.cuentas.hasValue() ? this.cuentas.value() : []));
  readonly numero = computed(() => this.lista().length);

  recargar(): void {
    this.cuentas.reload();
  }
}
