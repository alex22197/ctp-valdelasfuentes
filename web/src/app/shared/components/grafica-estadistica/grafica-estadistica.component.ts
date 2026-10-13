import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ECElementEvent, EChartsCoreOption } from 'echarts/core';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { ToqueGrafica } from './interfaces/toque-grafica.interface';

/**
 * Lienzo de una gráfica de ECharts. El alto se calcula según los datos (filas de la matriz,
 * jugadores…) y la descripción la leen los lectores de pantalla; los datos exactos están
 * además en una tabla junto a cada gráfica. Quien la use provee ECharts con
 * `provideEchartsCore({ echarts })` de `@shared/utils/graficas/echarts-configurado`.
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
  /** Cambios que se aplican encima de `opciones` sin redibujar la gráfica entera. */
  readonly cambios = input<EChartsCoreOption>({});
  /** Alto en píxeles. */
  readonly alto = input(260);
  readonly descripcion = input.required<string>();

  /** Se ha tocado un dato o una etiqueta de un eje. */
  readonly tocar = output<ToqueGrafica>();

  protected alTocar(evento: ECElementEvent): void {
    const esDato = evento.componentType === 'series';
    this.tocar.emit({
      componente: evento.componentType,
      indice: esDato ? evento.dataIndex : null,
      indiceSerie: esDato ? (evento.seriesIndex ?? null) : null,
      etiqueta: esDato ? null : String(evento.value ?? ''),
    });
  }
}
