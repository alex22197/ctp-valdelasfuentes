import { Injectable, inject } from '@angular/core';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearGestor } from './gestor.mapper';
import type { Gestor } from './interfaces/gestor.interface';

/**
 * Quién puede gestionar el equipo. Solo el administrador: la base de datos rechaza al resto,
 * así que la página solo lo pide si la sesión es de administrador.
 */
@Injectable({ providedIn: 'root' })
export class GestoresService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  async obtenerGestores(): Promise<Gestor[]> {
    const { data, error } = await this.supabase.rpc('listar_gestores');
    lanzarSiHayError(error, 'No se ha podido cargar la lista de gestores.');
    return (data ?? []).map(mapearGestor);
  }

  /** Si esa cuenta de Google ya ha entrado, tiene el permiso al momento; si no, al entrar. */
  async darPermiso(email: string, rol: RolUsuario): Promise<void> {
    const { error } = await this.supabase.rpc('dar_permiso_gestor', { p_email: email, p_rol: rol });
    lanzarSiHayError(error, mensajeDe(error, 'No se ha podido dar el permiso.'));
  }

  async quitarPermiso(email: string): Promise<void> {
    const { error } = await this.supabase.rpc('quitar_permiso_gestor', { p_email: email });
    lanzarSiHayError(error, mensajeDe(error, 'No se ha podido quitar el permiso.'));
  }
}

/** Las funciones explican en castellano por qué no dejan (p. ej., «tu propio permiso»). */
function mensajeDe(error: { message: string } | null, porDefecto: string): string {
  const conocidos = ['correo de Google válido', 'tu propio permiso', 'al menos un administrador'];
  return error && conocidos.some((texto) => error.message.includes(texto))
    ? error.message
    : porDefecto;
}
