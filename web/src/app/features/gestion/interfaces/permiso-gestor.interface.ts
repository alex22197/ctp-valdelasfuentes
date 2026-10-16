import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';

/** Dar (o cambiar) el papel de gestor a un correo de Google. */
export interface PermisoGestor {
  readonly email: string;
  readonly rol: RolUsuario;
}
