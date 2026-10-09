import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';

/** Clasificación oficial del grupo en la fase actual. */
@Component({
  selector: 'ctp-clasificacion-page',
  imports: [MensajeEstadoComponent, TablaClasificacionComponent],
  templateUrl: './clasificacion-page.component.html',
  styleUrl: './clasificacion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionPageComponent {
  private readonly competiciones = inject(CompeticionesService);
  private readonly clasificaciones = inject(ClasificacionService);

  protected readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  protected readonly fase = computed(() =>
    this.faseActual.hasValue() ? this.faseActual.value()?.fase : undefined,
  );

  protected readonly clasificacion = resource({
    params: () => this.fase()?.id,
    loader: ({ params: idFase }) => this.clasificaciones.obtenerClasificacion(idFase),
  });

  protected readonly filas = computed(() =>
    this.clasificacion.hasValue() ? this.clasificacion.value() : [],
  );
}
