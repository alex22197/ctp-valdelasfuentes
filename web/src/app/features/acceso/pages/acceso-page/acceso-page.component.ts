import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { AccionConEstado } from '@shared/utils/accion-con-estado';

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
  /** Entrar o salir: una sola acción en curso a la vez, con su error si lo hay. */
  protected readonly accion = new AccionConEstado();

  protected readonly nombreRol = computed(() => {
    const rol = this.auth.sesion()?.rol;
    return rol ? NOMBRE_ROL[rol] : null;
  });

  protected async entrar(): Promise<void> {
    await this.accion.ejecutar(() => this.auth.iniciarSesionConGoogle());
  }

  protected async salir(): Promise<void> {
    await this.accion.ejecutar(() => this.auth.cerrarSesion());
  }
}
