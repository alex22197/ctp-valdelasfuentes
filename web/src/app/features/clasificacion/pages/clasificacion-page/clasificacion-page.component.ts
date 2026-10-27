import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';
import { JornadasGrupoComponent } from '../../components/jornadas-grupo/jornadas-grupo.component';
import { agruparPorJornada } from '../../utils/jornadas-grupo';
import { describirActualizacion } from '../../utils/ultima-actualizacion';

/** Clasificación oficial del grupo en la fase actual y los resultados de todas sus jornadas. */
@Component({
  selector: 'ctp-clasificacion-page',
  imports: [MensajeEstadoComponent, TablaClasificacionComponent, JornadasGrupoComponent],
  templateUrl: './clasificacion-page.component.html',
  styleUrl: './clasificacion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionPageComponent {
  private readonly competiciones = inject(CompeticionesService);
  private readonly clasificaciones = inject(ClasificacionService);
  private readonly confrontaciones = inject(ConfrontacionesService);

  protected readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  protected readonly fase = computed(() =>
    this.faseActual.hasValue() ? this.faseActual.value()?.fase : undefined,
  );

  /** En una eliminatoria (retos), la clasificación que se enseña es la de la última liga. */
  protected readonly faseClasificacion = computed(() =>
    this.faseActual.hasValue() ? this.faseActual.value()?.faseClasificacion : undefined,
  );

  protected readonly clasificacion = resource({
    params: () => this.faseClasificacion()?.id,
    loader: ({ params: idFase }) => this.clasificaciones.obtenerClasificacion(idFase),
  });

  protected readonly filas = computed(() =>
    this.clasificacion.hasValue() ? this.clasificacion.value() : [],
  );

  protected readonly nota = computed(() => describirActualizacion(this.filas()));

  /** Las jornadas del grupo de la clasificación que se enseña: en los retos, las de la apertura. */
  protected readonly enfrentamientos = resource({
    params: () => this.faseClasificacion()?.id,
    loader: ({ params: idFase }) => this.confrontaciones.obtenerEnfrentamientosDelGrupo(idFase),
  });

  protected readonly jornadasGrupo = computed(() =>
    agruparPorJornada(this.enfrentamientos.hasValue() ? this.enfrentamientos.value() : []),
  );
}
