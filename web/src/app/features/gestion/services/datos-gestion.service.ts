import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { organizarJornadasGestion } from '../utils/jornadas-gestion';

/**
 * Datos de la página de gestión: la fase actual y su calendario, repartido en lo que le toca
 * hacer a un gestor. Se provee en la propia página.
 */
@Injectable()
export class DatosGestionService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly confrontaciones = inject(ConfrontacionesService);

  readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  readonly fase = computed(() => (this.faseActual.hasValue() ? this.faseActual.value() : null));

  readonly calendario = resource({
    params: () => this.fase()?.fase.id,
    loader: ({ params: idFase }) => this.confrontaciones.obtenerCalendarioNuestroEquipo(idFase),
  });

  readonly jornadas = computed(() => (this.calendario.hasValue() ? this.calendario.value() : []));

  readonly organizadas = computed(() =>
    organizarJornadasGestion(this.jornadas(), fechaIsoEnMadrid(new Date())),
  );

  readonly estado = computed((): 'cargando' | 'error' | 'sin-competicion' | 'lista' => {
    if (this.faseActual.error() || this.calendario.error()) {
      return 'error';
    }
    if (this.faseActual.isLoading() || this.calendario.isLoading()) {
      return 'cargando';
    }
    return this.fase() ? 'lista' : 'sin-competicion';
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
