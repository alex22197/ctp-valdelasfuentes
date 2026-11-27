import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { estaPorJugar, etiquetaEstadoJornada } from '@data-access/confrontaciones/estado-jornada';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { EstadoPorJugar } from '@data-access/confrontaciones/interfaces/estado-por-jugar.type';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { ACCION_INACTIVA } from '@shared/utils/accion-con-estado';
import type { EstadoAccion } from '@shared/utils/interfaces/estado-accion.type';
import { EstadoJornadaComponent } from '../estado-jornada/estado-jornada.component';

/**
 * Una jornada con lo que se puede gestionar de ella: su convocatoria, sus resultados y, si
 * sigue por jugar, aplazarla o suspenderla.
 */
@Component({
  selector: 'ctp-jornada-gestion',
  imports: [RouterLink, FechaConfrontacionPipe, EstadoJornadaComponent],
  templateUrl: './jornada-gestion.component.html',
  styleUrl: './jornada-gestion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JornadaGestionComponent {
  readonly jornada = input.required<ConfrontacionNuestroEquipo>();
  /** Cómo va el último cambio de estado pedido para esta jornada. */
  readonly cambioEstado = input<EstadoAccion>(ACCION_INACTIVA);
  readonly cambiarEstado = output<EstadoPorJugar>();

  /**
   * El estado si sigue por jugar; `null` si ya terminó (jugada o no comparecencia), que ya no
   * se convoca, aunque sus resultados se pueden corregir.
   */
  protected readonly estadoPorJugar = computed(() => {
    const estado = this.jornada().estado;
    return estaPorJugar(estado) ? estado : null;
  });

  protected readonly etiquetaEstado = computed(() => etiquetaEstadoJornada(this.jornada().estado));

  protected readonly accionResultados = computed(() => {
    if (this.estadoPorJugar() === null) {
      return 'Editar resultados';
    }
    return this.jornada().marcador ? 'Completar resultados' : 'Meter resultados';
  });
}
