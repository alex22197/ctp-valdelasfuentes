import { Injectable, inject } from '@angular/core';
import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import { lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { mapearCuentaPendiente } from './cuenta-pendiente.mapper';
import { mapearGestor } from './gestor.mapper';
import type { CuentaPendiente } from './interfaces/cuenta-pendiente.interface';
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

  /** Quien ha entrado con Google y espera a que el administrador decida, la más nueva primero. */
  async obtenerCuentasPendientes(): Promise<CuentaPendiente[]> {
    const { data, error } = await this.supabase.rpc('listar_cuentas_pendientes');
    lanzarSiHayError(error, 'No se han podido cargar las cuentas nuevas.');
    return (data ?? []).map(mapearCuentaPendiente);
  }

  /** La cuenta sigue pudiendo ver la web; solo deja de salir como pendiente. */
  async descartarCuenta(email: string): Promise<void> {
    const { error } = await this.supabase.rpc('descartar_cuenta', { p_email: email });
    lanzarSiHayError(error, mensajeDe(error, 'No se ha podido descartar la cuenta.'));
  }

  async quitarPermiso(email: string): Promise<void> {
    const { error } = await this.supabase.rpc('quitar_permiso_gestor', { p_email: email });
    lanzarSiHayError(error, mensajeDe(error, 'No se ha podido quitar el permiso.'));
  }
}

/** Las funciones explican en castellano por qué no dejan (p. ej., «tu propio permiso»). */
function mensajeDe(error: { message: string } | null, porDefecto: string): string {
  const conocidos = [
    'correo de Google válido',
    'tu propio permiso',
    'al menos un administrador',
    'tiene permisos',
    'ninguna cuenta con ese correo',
  ];
  return error && conocidos.some((texto) => error.message.includes(texto))
    ? error.message
    : porDefecto;
}
