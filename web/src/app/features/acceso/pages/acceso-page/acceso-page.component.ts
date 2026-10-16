import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';

const NOMBRE_ROL: Record<RolUsuario, string> = {
  admin: 'administrador',
  capitan: 'capitán',
};

/** Inicio y cierre de sesión con Google para quienes gestionan el equipo. */
@Component({
  selector: 'ctp-acceso-page',
  imports: [RouterLink, MensajeEstadoComponent],
  templateUrl: './acceso-page.component.html',
  styleUrl: './acceso-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccesoPageComponent {
  protected readonly auth = inject(AuthService);
  protected readonly enCurso = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly nombreRol = computed(() => {
    const rol = this.auth.sesion()?.rol;
    return rol ? NOMBRE_ROL[rol] : null;
  });

  protected async entrar(): Promise<void> {
    await this.ejecutar(() => this.auth.iniciarSesionConGoogle());
  }

  protected async salir(): Promise<void> {
    await this.ejecutar(() => this.auth.cerrarSesion());
  }

  private async ejecutar(accion: () => Promise<void>): Promise<void> {
    this.enCurso.set(true);
    this.error.set(null);
    try {
      await accion();
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.');
    } finally {
      this.enCurso.set(false);
    }
  }
}
