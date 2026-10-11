import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
} from '@angular/core';
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';
import { construirEvolucion, opcionesEvolucion } from '../../utils/evolucion-temporada';
import { CuadriculaJornadasComponent } from '../cuadricula-jornadas/cuadricula-jornadas.component';

/**
 * Puntos acumulados y partidos ganados jornada a jornada. Al tocar una jornada se enseña
 * su detalle (las seis pistas) debajo; por defecto, la última.
 */
@Component({
  selector: 'ctp-evolucion-temporada',
  imports: [GraficaEstadisticaComponent, CuadriculaJornadasComponent],
  templateUrl: './evolucion-temporada.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvolucionTemporadaComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly jornadas = input.required<readonly JornadaJugada[]>();
  /** Filas de la cuadrícula de las mismas jornadas, para el detalle. */
  readonly filas = input.required<readonly FilaCuadricula[]>();

  protected readonly evolucion = computed(() => construirEvolucion(this.jornadas()));

  protected readonly opciones = computed(() =>
    opcionesEvolucion(this.evolucion(), this.tema.colores, this.tema.animar),
  );

  /** Jornada elegida; vuelve a la última cuando cambian las jornadas (otra fase). */
  private readonly elegida = linkedSignal(() => this.evolucion().confrontaciones.at(-1) ?? null);

  protected readonly detalle = computed(() =>
    this.filas().filter((fila) => fila.confrontacionId === this.elegida()),
  );

  protected alTocar(toque: ToqueGrafica): void {
    const indice =
      toque.indice ??
      (toque.etiqueta !== null ? this.evolucion().etiquetas.indexOf(toque.etiqueta) : -1);
    const confrontacion = this.evolucion().confrontaciones[indice];
    if (confrontacion) {
      this.elegida.set(confrontacion);
    }
  }
}
