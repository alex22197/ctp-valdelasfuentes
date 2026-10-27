import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { estadoFase } from '@data-access/competiciones/estado-fase';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import {
  aplanarCalendario,
  conFaseActual,
} from '@data-access/confrontaciones/calendario-competicion';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { organizarJornadasGestion } from '../utils/jornadas-gestion';

/**
 * Datos de la página de gestión: la fase actual y el calendario de toda la competición,
 * repartido en lo que le toca hacer a un gestor. Se provee en la propia página.
 */
@Injectable()
export class DatosGestionService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly confrontaciones = inject(ConfrontacionesService);

  readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  readonly fase = computed(() => (this.faseActual.hasValue() ? this.faseActual.value() : null));

  /** Toda la competición: una jornada sin resultados de una fase anterior sigue saliendo. */
  readonly calendario = resource({
    params: () => this.fase()?.competicion.id,
    loader: ({ params: idCompeticion }) =>
      this.confrontaciones.obtenerCalendarioCompeticion(idCompeticion),
  });

  private readonly porFase = computed(() =>
    this.calendario.hasValue() ? this.calendario.value() : [],
  );

  /** El calendario por fases, con la actual aunque aún no tenga partidos. */
  readonly calendarioPorFase = computed(() => {
    const actual = this.fase()?.fase;
    return actual ? conFaseActual(this.porFase(), actual) : this.porFase();
  });

  readonly jornadas = computed(() => aplanarCalendario(this.porFase()));

  estadoDe(fase: Fase): EstadoFase {
    return estadoFase(fase, this.fase()?.fase ?? null);
  }

  readonly organizadas = computed(() =>
    organizarJornadasGestion(this.jornadas(), fechaIsoEnMadrid(new Date())),
  );

  readonly estado = computed((): 'cargando' | 'error' | 'sin-competicion' | 'lista' => {
    if (this.faseActual.error() || this.calendario.error()) {
      return 'error';
    }
    // Solo la primera carga es esqueleto: al recargar tras guardar, la página se queda como está
    // (con el formulario y lo escrito) y se actualiza al llegar los datos.
    if (!this.faseActual.hasValue()) {
      return 'cargando';
    }
    if (!this.fase()) {
      return 'sin-competicion';
    }
    return this.calendario.hasValue() ? 'lista' : 'cargando';
  });

  readonly guardandoJornada = signal(false);
  readonly errorJornada = signal<string | null>(null);

  /** Día y hora, sede y pistas de una jornada; después se recarga el calendario. */
  async guardarDatosJornada(idConfrontacion: string, datos: DatosConfrontacion): Promise<void> {
    if (this.guardandoJornada()) {
      return;
    }
    this.guardandoJornada.set(true);
    this.errorJornada.set(null);
    try {
      await this.confrontaciones.guardarDatos(idConfrontacion, datos);
      this.calendario.reload();
    } catch (error) {
      this.errorJornada.set(error instanceof Error ? error.message : 'No se ha podido guardar.');
    } finally {
      this.guardandoJornada.set(false);
    }
  }
}
