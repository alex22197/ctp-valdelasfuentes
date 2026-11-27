import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { etiquetaEstadoJornada } from '@data-access/confrontaciones/estado-jornada';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { SedePipe } from '@shared/pipes/sede.pipe';

/**
 * Bloque principal de la portada: el próximo partido dibujado sobre una pista,
 * con la red separando a los dos equipos.
 */
@Component({
  selector: 'ctp-proximo-partido',
  imports: [IconoComponent, FechaConfrontacionPipe, SedePipe],
  templateUrl: './proximo-partido.component.html',
  styleUrl: './proximo-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProximoPartidoComponent {
  readonly confrontacion = input.required<ConfrontacionNuestroEquipo>();
  /** La fase, para presentar un partido sin número de jornada (un reto, una eliminatoria). */
  readonly nombreFase = input<string | null>(null);

  /** «Aplazada» o «Suspendida» junto a la fecha, que entonces suele estar por confirmar. */
  protected readonly etiquetaEstado = computed(() =>
    etiquetaEstadoJornada(this.confrontacion().estado),
  );
}
