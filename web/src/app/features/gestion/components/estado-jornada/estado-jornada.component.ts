import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type { EstadoPorJugar } from '@data-access/confrontaciones/interfaces/estado-por-jugar.type';
import { ACCION_INACTIVA } from '@shared/utils/accion-con-estado';
import type { EstadoAccion } from '@shared/utils/interfaces/estado-accion.type';
import type { OpcionEstadoJornada } from '../../interfaces/opcion-estado-jornada.interface';
import { opcionesEstadoJornada } from '../../utils/opciones-estado-jornada';

/**
 * Los cambios de estado de una jornada por jugar: aplazarla, suspenderla o quitarle el
 * aplazamiento. Aplazar y suspender borran la fecha, así que se confirman en dos pasos.
 */
@Component({
  selector: 'ctp-estado-jornada',
  templateUrl: './estado-jornada.component.html',
  styleUrl: './estado-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadoJornadaComponent {
  readonly estado = input.required<EstadoPorJugar>();
  /** Para los lectores de pantalla: «contra Pa'delante». */
  readonly contra = input.required<string>();
  /** Cómo va el último cambio pedido para esta jornada. */
  readonly accion = input<EstadoAccion>(ACCION_INACTIVA);
  readonly cambiar = output<EstadoPorJugar>();

  /** La opción que espera confirmación; `null` si no hay ninguna. */
  protected readonly confirmando = signal<OpcionEstadoJornada | null>(null);
  protected readonly opciones = computed(() => opcionesEstadoJornada(this.estado()));
  protected readonly enCurso = computed(() => this.accion().tipo === 'en-curso');
  protected readonly error = computed(() => {
    const accion = this.accion();
    return accion.tipo === 'error' ? accion.mensaje : null;
  });

  protected elegir(opcion: OpcionEstadoJornada): void {
    if (opcion.confirmacion) {
      this.confirmando.set(opcion);
    } else {
      this.cambiar.emit(opcion.destino);
    }
  }

  protected confirmar(opcion: OpcionEstadoJornada): void {
    this.confirmando.set(null);
    this.cambiar.emit(opcion.destino);
  }
}
