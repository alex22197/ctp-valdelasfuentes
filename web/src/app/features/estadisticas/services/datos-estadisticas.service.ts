import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { EstadisticasEquipoService } from '@data-access/estadisticas/estadisticas-equipo.service';
import { EstadisticasJugadoresService } from '@data-access/estadisticas/estadisticas-jugadores.service';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import type { JugadorResaltado } from '../interfaces/jugador-resaltado.interface';
import { construirCuadricula } from '../utils/cuadricula-jornadas';

/**
 * Datos de la página de estadísticas de la competición activa, filtrados por la fase
 * elegida (`null`: toda la liga), y el jugador resaltado en todas las gráficas. Se provee
 * en la propia página.
 */
@Injectable()
export class DatosEstadisticasService {
  private readonly auth = inject(AuthService);
  private readonly competiciones = inject(CompeticionesService);
  private readonly jugadoresService = inject(JugadoresService);
  private readonly estadisticas = inject(EstadisticasService);
  private readonly equipo = inject(EstadisticasEquipoService);
  private readonly jugadoresEquipo = inject(EstadisticasJugadoresService);

  /** Fase elegida en el filtro; `null` es toda la liga. */
  readonly idFase = signal<string | null>(null);

  /** Jugador tocado en una gráfica: se resalta en todas. */
  readonly resaltado = signal<JugadorResaltado | null>(null);
  readonly idResaltado = computed(() => this.resaltado()?.id ?? null);

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
    loader: ({ params: id }) => this.jugadoresService.obtenerPlantilla(id),
  });

  readonly puestos = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.equipo.obtenerPuestos(params.competicion, params.fase),
  });

  readonly parejas = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.equipo.obtenerParejas(params.competicion, params.fase),
  });

  readonly jugadores = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.jugadoresEquipo.obtenerJugadores(params.competicion, params.fase),
  });

  readonly lados = resource({
    params: () => this.filtro(),
    loader: ({ params }) => this.jugadoresEquipo.obtenerLados(params.competicion, params.fase),
  });

  readonly esGestor = computed(() => this.auth.lista() && this.auth.esGestor());

  /** Jornadas jugadas de la fase elegida, en orden. */
  readonly jornadasDeFase = computed(() => {
    const fase = this.idFase();
    const jornadas = this.jornadas.hasValue() ? this.jornadas.value() : [];
    return jornadas.filter((j) => fase === null || j.faseId === fase);
  });

  readonly cuadricula = computed(() => {
    const activa = this.activa();
    if (!activa || !this.partidos.hasValue()) {
      return [];
    }
    return construirCuadricula(this.jornadasDeFase(), this.partidos.value(), activa.formato);
  });

  /** Sexo de cada jugador, para el ranking y para orientar la matriz del mixto. */
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

  /** Tocar al mismo jugador otra vez deja de resaltarlo. */
  resaltar(jugador: JugadorResaltado): void {
    this.resaltado.update((actual) => (actual?.id === jugador.id ? null : jugador));
  }
}
