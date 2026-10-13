import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { ResumenJugador } from '@data-access/estadisticas/interfaces/resumen-jugador.interface';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import { opcionesAnillo, opcionesSetsJuegos } from '../../utils/opciones-ficha';

/** Anillo de ganados y perdidos y barras de sets y juegos de un jugador. */
@Component({
  selector: 'ctp-balance-jugador',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './balance-jugador.component.html',
  styleUrl: './balance-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceJugadorComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly resumen = input.required<ResumenJugador>();

  protected readonly anillo = computed(() =>
    opcionesAnillo(this.resumen(), this.tema.colores, this.tema.animar),
  );
  protected readonly setsJuegos = computed(() =>
    opcionesSetsJuegos(this.resumen(), this.tema.colores, this.tema.animar),
  );
}
