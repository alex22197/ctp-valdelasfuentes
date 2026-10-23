import type { RolUsuario } from '@core/auth/interfaces/rol-usuario.type';
import type { CuentaPendiente } from '@data-access/gestores/interfaces/cuenta-pendiente.interface';

/** El papel que el administrador da a una cuenta nueva. */
export interface DecisionCuenta {
  readonly cuenta: CuentaPendiente;
  readonly rol: RolUsuario;
}
