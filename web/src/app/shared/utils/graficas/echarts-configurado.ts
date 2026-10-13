import { BarChart, HeatmapChart, LineChart, PieChart } from 'echarts/charts';
import {
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

// Solo las piezas que usan las gráficas de la web: así ECharts pesa mucho menos y solo se
// descarga al abrir una página con gráficas (estadísticas o ficha de jugador).
echarts.use([
  BarChart,
  HeatmapChart,
  LineChart,
  PieChart,
  AriaComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  VisualMapComponent,
  CanvasRenderer,
]);

export { echarts };
