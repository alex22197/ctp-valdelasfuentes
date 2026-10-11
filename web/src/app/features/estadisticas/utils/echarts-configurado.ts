import { BarChart, HeatmapChart } from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

// Solo las piezas que usan las gráficas de estadísticas: así ECharts pesa mucho menos y
// solo se descarga al abrir esta página.
echarts.use([
  BarChart,
  HeatmapChart,
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export { echarts };
