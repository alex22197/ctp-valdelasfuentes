import { computed, signal, type Signal } from '@angular/core';
import type { EstadoAccion } from './interfaces/estado-accion.type';

export const ACCION_INACTIVA: EstadoAccion = { tipo: 'inactivo' };

/**
 * Una acción que tarda (guardar, publicar, entrar…) con su estado explícito: inactiva, en
 * curso, hecha o con error. Es la única forma de «guardar con estado» en la web (ADR 0013):
 * - Mientras está en curso no se vuelve a lanzar, así que no hay dobles envíos.
 * - «Hecha» es un estado de verdad: quien la use puede cerrar un formulario al llegar a él,
 *   en vez de adivinarlo por si cambian los datos.
 * - El error guarda el mensaje de la excepción (los servicios de datos lo dan en castellano)
 *   o el que se le pase por defecto.
 */
export class AccionConEstado {
  private readonly actual = signal<EstadoAccion>(ACCION_INACTIVA);

  readonly estado: Signal<EstadoAccion> = this.actual.asReadonly();
  readonly enCurso = computed(() => this.actual().tipo === 'en-curso');
  readonly error = computed(() => {
    const estado = this.actual();
    return estado.tipo === 'error' ? estado.mensaje : null;
  });

  constructor(private readonly mensajePorDefecto = 'Ha ocurrido un error inesperado.') {}

  /** Lanza la acción si no hay otra en curso. Devuelve `true` si terminó bien. */
  async ejecutar(accion: () => Promise<void>): Promise<boolean> {
    if (this.enCurso()) {
      return false;
    }
    this.actual.set({ tipo: 'en-curso' });
    try {
      await accion();
      this.actual.set({ tipo: 'hecho' });
      return true;
    } catch (error) {
      const mensaje =
        error instanceof Error && error.message ? error.message : this.mensajePorDefecto;
      this.actual.set({ tipo: 'error', mensaje });
      return false;
    }
  }

  /** Vuelve a inactiva, por ejemplo al cerrar un formulario. */
  reiniciar(): void {
    this.actual.set(ACCION_INACTIVA);
  }
}
