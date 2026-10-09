import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';

/**
 * Bloque principal de la portada: el próximo partido dibujado sobre una pista,
 * con la red separando a los dos equipos.
 */
@Component({
  selector: 'ctp-proximo-partido',
  imports: [IconoComponent, FechaConfrontacionPipe],
  templateUrl: './proximo-partido.component.html',
  styleUrl: './proximo-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProximoPartidoComponent {
  readonly confrontacion = input.required<ConfrontacionNuestroEquipo>();
}
