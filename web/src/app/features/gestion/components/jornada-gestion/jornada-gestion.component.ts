import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';

/** Una jornada con lo que se puede gestionar de ella: su convocatoria y sus resultados. */
@Component({
  selector: 'ctp-jornada-gestion',
  imports: [RouterLink, FechaConfrontacionPipe],
  templateUrl: './jornada-gestion.component.html',
  styleUrl: './jornada-gestion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JornadaGestionComponent {
  readonly jornada = input.required<ConfrontacionNuestroEquipo>();

  /** Una jornada jugada ya no se convoca; sus resultados se pueden corregir. */
  protected readonly jugada = computed(() => this.jornada().estado === 'jugada');

  protected readonly accionResultados = computed(() => {
    if (this.jugada()) {
      return 'Editar resultados';
    }
    return this.jornada().marcador ? 'Completar resultados' : 'Meter resultados';
  });
}
