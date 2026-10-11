import { ChangeDetectionStrategy, Component, computed, inject, resource } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { ListaPlantillaComponent } from '../../components/lista-plantilla/lista-plantilla.component';
import { agruparPlantilla } from '../../utils/agrupar-plantilla';

/** Plantilla pública del equipo: cada jugador lleva a su ficha. */
@Component({
  selector: 'ctp-plantilla-page',
  imports: [MensajeEstadoComponent, ListaPlantillaComponent],
  templateUrl: './plantilla-page.component.html',
  styleUrl: './plantilla-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlantillaPageComponent {
  private readonly competiciones = inject(CompeticionesService);
  private readonly jugadores = inject(JugadoresService);
  private readonly estadisticas = inject(EstadisticasService);

  /** Los comodines solo se enlazan para los gestores: no tienen ficha pública. */
  protected readonly enlazarComodines = inject(AuthService).esGestor;

  protected readonly competicion = resource({
    loader: () => this.competiciones.obtenerCompeticionActiva(),
  });

  private readonly idCompeticion = computed(() =>
    this.competicion.hasValue() ? this.competicion.value()?.id : undefined,
  );

  protected readonly plantilla = resource({
    params: () => this.idCompeticion(),
    loader: ({ params: id }) => this.jugadores.obtenerPlantilla(id),
  });

  protected readonly resumenes = resource({
    params: () => this.idCompeticion(),
    loader: ({ params: id }) => this.estadisticas.obtenerResumenesJugadores(id),
  });

  protected readonly grupos = computed(() =>
    agruparPlantilla(
      this.plantilla.hasValue() ? this.plantilla.value() : [],
      this.resumenes.hasValue() ? this.resumenes.value() : new Map(),
    ),
  );

  protected readonly cargando = computed(
    () => this.competicion.isLoading() || this.plantilla.isLoading() || this.resumenes.isLoading(),
  );

  protected readonly error = computed(
    () => !!(this.competicion.error() || this.plantilla.error() || this.resumenes.error()),
  );
}
