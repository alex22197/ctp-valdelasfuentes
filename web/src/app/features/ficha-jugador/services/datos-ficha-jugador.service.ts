import { Injectable, computed, inject, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '@core/auth/auth.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { EstadisticasService } from '@data-access/estadisticas/estadisticas.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import type { EstadoFicha } from '../interfaces/estado-ficha.type';
import { ladoHabitual } from '../utils/lado-habitual';
import { construirTemporada } from '../utils/temporada-jugador';

/**
 * Datos de la ficha del jugador de la ruta en la competición activa. Los comodines no
 * tienen ficha pública: solo la ven los gestores. Se provee en la propia página.
 */
@Injectable()
export class DatosFichaJugadorService {
  private readonly auth = inject(AuthService);
  private readonly competiciones = inject(CompeticionesService);
  private readonly jugadores = inject(JugadoresService);
  private readonly estadisticasService = inject(EstadisticasService);

  private readonly idJugador = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((parametros) => parametros.get('idJugador'))),
  );

  readonly competicion = resource({
    loader: () => this.competiciones.obtenerCompeticionActiva(),
  });

  private readonly idCompeticion = computed(() =>
    this.competicion.hasValue() ? this.competicion.value()?.id : undefined,
  );

  private readonly jugadorCargado = resource({
    params: () => {
      const competicion = this.idCompeticion();
      const jugador = this.idJugador();
      return competicion && jugador ? { competicion, jugador } : undefined;
    },
    loader: ({ params }) =>
      this.jugadores.obtenerJugadorDePlantilla(params.competicion, params.jugador),
  });

  readonly jugador = computed(() =>
    this.jugadorCargado.hasValue() ? this.jugadorCargado.value() : null,
  );

  /** Si quien mira puede ver la ficha. Espera a saber si hay sesión para no dar un salto. */
  private readonly visible = computed(() => {
    const jugador = this.jugador();
    return !!jugador && this.auth.lista() && (!jugador.comodin || this.auth.esGestor());
  });

  /** Los compañeros comodines solo se enlazan para los gestores. */
  readonly enlazarComodines = this.auth.esGestor;

  private readonly estadisticas = resource({
    params: () => {
      const competicion = this.idCompeticion();
      const jugador = this.jugador();
      return this.visible() && competicion && jugador
        ? { competicion, jugador: jugador.id }
        : undefined;
    },
    loader: ({ params }) =>
      this.estadisticasService.obtenerEstadisticasJugador(params.competicion, params.jugador),
  });

  private readonly jornadas = resource({
    params: () => (this.visible() ? this.idCompeticion() : undefined),
    loader: ({ params: competicion }) =>
      this.estadisticasService.obtenerJornadasJugadas(competicion),
  });

  readonly datos = computed(() =>
    this.estadisticas.hasValue() ? this.estadisticas.value() : null,
  );

  readonly temporada = computed(() =>
    construirTemporada(
      this.jornadas.hasValue() ? this.jornadas.value() : [],
      this.datos()?.partidos ?? [],
    ),
  );

  readonly lado = computed(() =>
    ladoHabitual(this.jugador()?.ladoPreferido ?? null, this.datos()?.lados ?? []),
  );

  readonly estado = computed<EstadoFicha>(() => {
    if (this.competicion.error() || this.jugadorCargado.error()) {
      return 'error';
    }
    if (!this.competicion.hasValue()) {
      return 'cargando';
    }
    if (!this.competicion.value()) {
      return 'sin-competicion';
    }
    if (!this.jugadorCargado.hasValue() || !this.auth.lista()) {
      return 'cargando';
    }
    const jugador = this.jugador();
    if (!jugador) {
      return 'no-encontrado';
    }
    if (!this.visible()) {
      return 'comodin';
    }
    if (this.estadisticas.error() || this.jornadas.error()) {
      return 'error';
    }
    return this.estadisticas.hasValue() && this.jornadas.hasValue() ? 'lista' : 'cargando';
  });
}
