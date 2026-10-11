import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';

/**
 * Lienzo de una gráfica de ECharts. El alto se calcula según los datos (filas de la matriz,
 * jugadores…) y la descripción la leen los lectores de pantalla; los datos exactos están
 * además en una tabla junto a cada gráfica.
 */
@Component({
  selector: 'ctp-grafica-estadistica',
  imports: [NgxEchartsDirective],
  templateUrl: './grafica-estadistica.component.html',
  styleUrl: './grafica-estadistica.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficaEstadisticaComponent {
  readonly opciones = input.required<EChartsCoreOption>();
  /** Alto en píxeles. */
  readonly alto = input(260);
  readonly descripcion = input.required<string>();
}
