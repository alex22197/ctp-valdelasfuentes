import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import type { Gestor } from '@data-access/gestores/interfaces/gestor.interface';
import type { PermisoGestor } from '../../interfaces/permiso-gestor.interface';

/**
 * Quién gestiona el equipo y el formulario para dar permiso con un correo de Google. Quitar
 * pide confirmación; la fila propia no tiene acciones (nadie se quita a sí mismo).
 */
@Component({
  selector: 'ctp-lista-gestores',
  templateUrl: './lista-gestores.component.html',
  styleUrl: './lista-gestores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaGestoresComponent {
  readonly gestores = input.required<readonly Gestor[]>();
  readonly ocupado = input(false);
  /** Cuando llega la confirmación de un permiso, se vacía el formulario. */
  readonly aviso = input<string | null>(null);
  readonly dar = output<PermisoGestor>();
  readonly cambiarRol = output<PermisoGestor>();
  readonly quitar = output<string>();

  /** Se vacía cuando llega la confirmación; si falla, lo escrito se queda. */
  protected readonly email = linkedSignal<string | null, string>({
    source: this.aviso,
    computation: (aviso, anterior) => (aviso ? '' : (anterior?.value ?? '')),
  });
  protected readonly rol = signal<RolUsuario>('capitan');
  /** Correo cuya retirada se está confirmando. */
  protected readonly confirmando = signal<string | null>(null);

  protected readonly nombreRol: Record<RolUsuario, string> = {
    admin: 'Administrador',
    capitan: 'Capitán',
  };

  protected leer(evento: Event): string {
    return (evento.target as HTMLInputElement | HTMLSelectElement).value;
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    if (this.email().trim()) {
      this.dar.emit({ email: this.email(), rol: this.rol() });
    }
  }

  protected cambiar(gestor: Gestor): void {
    this.cambiarRol.emit({
      email: gestor.email,
      rol: gestor.rol === 'admin' ? 'capitan' : 'admin',
    });
  }

  protected confirmarQuitar(gestor: Gestor): void {
    this.confirmando.set(null);
    this.quitar.emit(gestor.email);
  }
}
