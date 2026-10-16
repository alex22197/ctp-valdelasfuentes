import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { GestoresService } from '@data-access/gestores/gestores.service';

/**
 * Los gestores del equipo para la página de gestión. Solo se piden si la sesión es de
 * administrador: a un capitán la base de datos se los negaría. Se provee en la página.
 */
@Injectable()
export class GestoresGestionService {
  private readonly auth = inject(AuthService);
  private readonly gestoresService = inject(GestoresService);

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
      return true;
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.');
      return false;
    } finally {
      this.ocupado.set(false);
    }
  }
}
