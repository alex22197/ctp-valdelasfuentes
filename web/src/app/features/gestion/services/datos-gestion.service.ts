import { Injectable, computed, inject, resource } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { estadoFase } from '@data-access/competiciones/estado-fase';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import {
  aplanarCalendario,
  conFaseActual,
  masRecientePrimero,
} from '@data-access/confrontaciones/calendario-competicion';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { AccionConEstado } from '@shared/utils/accion-con-estado';
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

  /** El calendario por fases, con la actual aunque aún no tenga partidos y la más reciente arriba. */
  readonly calendarioPorFase = computed(() => {
    const actual = this.fase()?.fase;
    return masRecientePrimero(actual ? conFaseActual(this.porFase(), actual) : this.porFase());
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

  /** Día y hora, sede y pistas de una jornada; después se recarga el calendario. */
  readonly guardadoJornada = new AccionConEstado('No se ha podido guardar.');

  async guardarDatosJornada(idConfrontacion: string, datos: DatosConfrontacion): Promise<void> {
    await this.guardadoJornada.ejecutar(async () => {
      await this.confrontaciones.guardarDatos(idConfrontacion, datos);
      this.calendario.reload();
    });
  }
}
