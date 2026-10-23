import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { FilaBalance } from '@shared/utils/graficas/interfaces/fila-balance.interface';
import {
  altoBalance,
  describirBalance,
  opcionesBalance,
} from '@shared/utils/graficas/opciones-balance';

/**
 * Barras de ganados y perdidos, una por fila (en casa y fuera, por categoría, a tres sets…),
 * con su tabla de datos. `unidad` es lo que se cuenta: partidos o sets.
 */
@Component({
  selector: 'ctp-barras-balance',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './barras-balance.component.html',
  styleUrl: './barras-balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BarrasBalanceComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly filas = input.required<readonly FilaBalance[]>();
  readonly unidad = input('partidos');

  protected readonly opciones = computed(() =>
    opcionesBalance(this.filas(), this.tema.colores, this.tema.animar),
  );
  protected readonly alto = computed(() => altoBalance(this.filas()));
  protected readonly descripcion = computed(
    () => `Barras de ${this.unidad()} ganados y perdidos. ${describirBalance(this.filas())}`,
  );

  protected porcentaje(fila: FilaBalance): number | null {
    const total = fila.ganados + fila.perdidos;
    return total ? Math.round((100 * fila.ganados) / total) : null;
  }
}
