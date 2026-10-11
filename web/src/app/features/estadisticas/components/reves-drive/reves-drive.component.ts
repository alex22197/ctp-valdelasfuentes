import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { LadosJugador } from '@data-access/estadisticas/interfaces/lados-jugador.interface';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { JugadorResaltado } from '../../interfaces/jugador-resaltado.interface';
import { jugadorDeLista } from '../../utils/jugador-tocado';
import { ALTO_FILA_RANKING } from '../../utils/ranking-jugadores';
import { datosLados, opcionesLados, ordenarLados } from '../../utils/reves-drive';

/** Partidos de revés y de drive de cada jugador; tocar uno lo resalta en todas. */
@Component({
  selector: 'ctp-reves-drive',
  imports: [RouterLink, GraficaEstadisticaComponent],
  templateUrl: './reves-drive.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RevesDriveComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly lados = input.required<readonly LadosJugador[]>();
  readonly idResaltado = input<string | null>(null);
  readonly enlazarComodines = input(false);
  readonly resaltar = output<JugadorResaltado>();

  protected readonly lista = computed(() => ordenarLados(this.lados()));

  protected readonly opciones = computed(() =>
    opcionesLados(this.lista(), this.tema.colores, this.tema.animar),
  );

  protected readonly cambios = computed(() => {
    const { reves, drive } = datosLados(this.lista(), this.idResaltado());
    return { series: [{ data: reves }, { data: drive }] };
  });

  protected readonly alto = computed(() => this.lista().length * ALTO_FILA_RANKING + 48);

  protected alTocar(toque: ToqueGrafica): void {
    const jugador = jugadorDeLista(this.lista(), toque);
    if (jugador) {
      this.resaltar.emit(jugador);
    }
  }
}
