import { Injectable, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { EstadisticasEquipoService } from '@data-access/estadisticas/estadisticas-equipo.service';
import { EstadisticasJugadoresService } from '@data-access/estadisticas/estadisticas-jugadores.service';
import { balanceCasaFuera, balancePorCategoria, partidosAjustados } from '../utils/balance-equipo';
import { sumarPartidosDelGrupo } from '../utils/partidos-grupo';
import { DatosEstadisticasService } from './datos-estadisticas.service';

/**
 * Lo que necesitan las gráficas del equipo (mapa de forma, nosotros contra el grupo, casa y
 * fuera, partidos ajustados), filtrado por la fase elegida en `DatosEstadisticasService`. Se
 * provee en la página de estadísticas.
 */
@Injectable()
export class DatosEquipoService {
  private readonly datos = inject(DatosEstadisticasService);
  private readonly equipo = inject(EstadisticasEquipoService);
  private readonly jugadoresEquipo = inject(EstadisticasJugadoresService);
  private readonly clasificacion = inject(ClasificacionService);

  private readonly filtro = computed(() => {
    const activa = this.datos.activa();
    return activa ? { competicion: activa.competicion.id, fase: this.datos.idFase() } : undefined;
  });

  readonly partidos = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.equipo.obtenerPartidosEquipo(params.competicion, params.fase),
  });

  readonly partidosJugadores = resource({
    params: () => this.filtro(),
    loader: ({ params }) =>
      this.jugadoresEquipo.obtenerPartidosJugadores(params.competicion, params.fase),
  });

  /** Las fases que se suman en «nosotros contra el grupo»: la elegida, o todas. */
  private readonly idsFases = computed(() => {
    const activa = this.datos.activa();
    if (!activa) {
      return undefined;
    }
    const fase = this.datos.idFase();
    return fase ? [fase] : activa.fases.map((f) => f.id);
  });

  readonly grupo = resource({
    params: () => this.idsFases(),
    loader: ({ params }) => this.clasificacion.obtenerPartidosDelGrupo(params),
  });

  readonly equiposGrupo = computed(() =>
    sumarPartidosDelGrupo(this.grupo.hasValue() ? this.grupo.value() : []),
  );

  private readonly lista = computed(() => (this.partidos.hasValue() ? this.partidos.value() : []));

  readonly casaFuera = computed(() => balanceCasaFuera(this.lista()));
  readonly categorias = computed(() => balancePorCategoria(this.lista()));
  readonly ajustados = computed(() => partidosAjustados(this.lista()));

  readonly listaJugadores = computed(() =>
    this.partidosJugadores.hasValue() ? this.partidosJugadores.value() : [],
  );
}
