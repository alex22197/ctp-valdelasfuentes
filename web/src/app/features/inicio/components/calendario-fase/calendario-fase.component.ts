import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';

/** Lista de jornadas de nuestro equipo en la fase, con rival, fecha y resultado. */
@Component({
  selector: 'ctp-calendario-fase',
  imports: [RouterLink, MensajeEstadoComponent, FechaConfrontacionPipe],
  templateUrl: './calendario-fase.component.html',
  styleUrl: './calendario-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioFaseComponent {
  readonly confrontaciones = input.required<readonly ConfrontacionNuestroEquipo[]>();
  /** Muestra en cada jornada el enlace para meter sus resultados (solo gestores). */
  readonly enlacesResultados = input(false);
}
