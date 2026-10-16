import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';

/** Alguien con permiso para gestionar el equipo, o invitado a tenerlo. */
export interface Gestor {
  readonly email: string;
  /** El nombre de su cuenta de Google; `null` si aún no ha entrado. */
  readonly nombre: string | null;
  readonly rol: RolUsuario;
  /** Invitado que todavía no ha entrado con Google. */
  readonly pendiente: boolean;
  /** La persona que está mirando la lista. */
  readonly esTu: boolean;
}
