import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { EstadisticasEquipoService } from '@data-access/estadisticas/estadisticas-equipo.service';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { construirCuadricula } from '../utils/cuadricula-jornadas';

/**
 * Datos de la página de estadísticas de la competición activa, filtrados por la fase
 * elegida (`null`: toda la liga). La participación solo se pide si quien mira es gestor:
 * para el resto la base de datos la deniega. Se provee en la propia página.
 */
@Injectable()
export class DatosEstadisticasService {
  private readonly auth = inject(AuthService);
  private readonly competiciones = inject(CompeticionesService);
  private readonly jugadores = inject(JugadoresService);
  private readonly estadisticas = inject(EstadisticasService);
  private readonly equipo = inject(EstadisticasEquipoService);

  /** Fase elegida en el filtro; `null` es toda la liga. */
  readonly idFase = signal<string | null>(null);

  readonly competicion = resource({
    loader: () => this.competiciones.obtenerCompeticionActivaConFases(),
  });

  readonly activa = computed(() => (this.competicion.hasValue() ? this.competicion.value() : null));

  private readonly idCompeticion = computed(() => this.activa()?.competicion.id);

  private readonly filtro = computed(() => {
    const competicion = this.idCompeticion();
    return competicion ? { competicion, fase: this.idFase() } : undefined;
  });

  private readonly jornadas = resource({
    params: () => this.idCompeticion(),
    loader: ({ params: id }) => this.estadisticas.obtenerJornadasJugadas(id),
  });

  private readonly partidos = resource({
    params: () =>
      this.jornadas.hasValue() ? this.jornadas.value().map((j) => j.confrontacionId) : undefined,
    loader: ({ params: ids }) => this.equipo.obtenerPartidosDeJornadas(ids),
  });

  private readonly plantilla = resource({
    params: () => this.idCompeticion(),
    loader: ({ params: id }) => this.jugadores.obtenerPlantilla(id),
  });

  readonly puestos = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.equipo.obtenerPuestos(params.competicion, params.fase),
  });

  readonly parejas = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.equipo.obtenerParejas(params.competicion, params.fase),
  });

  readonly esGestor = computed(() => this.auth.lista() && this.auth.esGestor());

  readonly participacion = resource({
    params: () => (this.esGestor() ? this.filtro() : undefined),
    loader: ({ params }) => this.equipo.obtenerParticipacion(params.competicion, params.fase),
  });

  readonly cuadricula = computed(() => {
    const activa = this.activa();
    if (!activa || !this.jornadas.hasValue() || !this.partidos.hasValue()) {
      return [];
    }
    const fase = this.idFase();
    const jornadas = this.jornadas.value().filter((j) => fase === null || j.faseId === fase);
    return construirCuadricula(jornadas, this.partidos.value(), activa.formato);
  });

  /** Sexo de cada jugador, para orientar la matriz del mixto. */
  readonly sexos = computed(
    () =>
      new Map((this.plantilla.hasValue() ? this.plantilla.value() : []).map((j) => [j.id, j.sexo])),
  );

  /** Estado de la jornada a jornada, que depende de dos cargas. */
  readonly estadoCuadricula = computed<'cargando' | 'error' | 'lista'>(() => {
    if (this.jornadas.error() || this.partidos.error()) {
      return 'error';
    }
    return this.jornadas.hasValue() && this.partidos.hasValue() ? 'lista' : 'cargando';
  });

  /** Estado de la página: solo espera a la competición; cada sección lleva el suyo. */
  readonly estado = computed<'cargando' | 'error' | 'sin-competicion' | 'lista'>(() => {
    if (this.competicion.error()) {
      return 'error';
    }
    if (!this.competicion.hasValue()) {
      return 'cargando';
    }
    return this.competicion.value() ? 'lista' : 'sin-competicion';
  });
}
