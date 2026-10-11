import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { FaseTemporada } from '../../interfaces/fase-temporada.interface';
import { opcionesTemporada } from '../../utils/opciones-ficha';

/** Barras con la diferencia de juegos de cada jornada: arriba si ganó, abajo si perdió. */
@Component({
  selector: 'ctp-grafica-temporada',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './grafica-temporada.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaTemporadaComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly fases = input.required<readonly FaseTemporada[]>();

  protected readonly opciones = computed(() =>
    opcionesTemporada(this.fases(), this.tema.colores, this.tema.animar),
  );
}
