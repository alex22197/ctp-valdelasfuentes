import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CuentasNuevasService } from '@core/auth/cuentas-nuevas.service';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { GestoresService } from '@data-access/gestores/gestores.service';
import type { CuentaPendiente } from '@data-access/gestores/interfaces/cuenta-pendiente.interface';

/**
 * Los gestores del equipo y las cuentas nuevas para la página de gestión. Solo se piden si la
 * sesión es de administrador: a un capitán la base de datos se los negaría. Se provee en la
 * página.
 */
@Injectable()
export class GestoresGestionService {
  private readonly auth = inject(AuthService);
  private readonly gestoresService = inject(GestoresService);
  readonly cuentasNuevas = inject(CuentasNuevasService);

  readonly gestores = resource({
    params: () => (this.auth.esAdmin() ? true : undefined),
    loader: () => this.gestoresService.obtenerGestores(),
  });

  readonly lista = computed(() => (this.gestores.hasValue() ? this.gestores.value() : []));
  readonly ocupado = signal(false);
  readonly error = signal<string | null>(null);
  /** Lo que acaba de pasar, para confirmarlo junto al formulario. */
  readonly aviso = signal<string | null>(null);

  async darPermiso(email: string, rol: RolUsuario): Promise<boolean> {
    const hecho = await this.ejecutar(() => this.gestoresService.darPermiso(email, rol));
    if (hecho) {
      this.aviso.set(
        `Listo. ${email.trim()} verá «Gestión» cuando entre con esa cuenta de Google (si ya estaba ` +
          'dentro, al recargar la página).',
      );
    }
    return hecho;
  }

  async cambiarRol(email: string, rol: RolUsuario): Promise<void> {
    await this.ejecutar(() => this.gestoresService.darPermiso(email, rol));
  }

  async quitarPermiso(email: string): Promise<void> {
    await this.ejecutar(() => this.gestoresService.quitarPermiso(email));
  }

  /** Una cuenta nueva pasa a gestionar: lo tiene en cuanto recargue la web. */
  async aceptarCuenta(cuenta: CuentaPendiente, rol: RolUsuario): Promise<void> {
    const hecho = await this.ejecutar(() => this.gestoresService.darPermiso(cuenta.email, rol));
    if (hecho) {
      const papel = rol === 'admin' ? 'administrador' : 'capitán';
      this.aviso.set(
        `Listo: ${cuenta.nombre ?? cuenta.email} ya es ${papel}. Verá «Gestión» al recargar la web.`,
      );
    }
  }

  /** Sigue pudiendo ver la web; solo deja de salir aquí. */
  async descartarCuenta(cuenta: CuentaPendiente): Promise<void> {
    const hecho = await this.ejecutar(() => this.gestoresService.descartarCuenta(cuenta.email));
    if (hecho) {
      this.aviso.set(`Descartada: ${cuenta.nombre ?? cuenta.email} ya no saldrá aquí.`);
    }
  }

  private async ejecutar(accion: () => Promise<void>): Promise<boolean> {
    if (this.ocupado()) {
      return false;
    }
    this.ocupado.set(true);
    this.error.set(null);
    this.aviso.set(null);
    try {
      await accion();
      this.gestores.reload();
      this.cuentasNuevas.recargar();
      return true;
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.');
      return false;
    } finally {
      this.ocupado.set(false);
    }
  }
}
