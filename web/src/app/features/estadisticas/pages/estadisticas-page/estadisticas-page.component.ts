import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideEchartsCore } from 'ngx-echarts';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { CuadriculaJornadasComponent } from '../../components/cuadricula-jornadas/cuadricula-jornadas.component';
import { FiltroFaseComponent } from '../../components/filtro-fase/filtro-fase.component';
import { ParejasRepetidasComponent } from '../../components/parejas-repetidas/parejas-repetidas.component';
import { ParticipacionEquipoComponent } from '../../components/participacion-equipo/participacion-equipo.component';
import { QuienConQuienComponent } from '../../components/quien-con-quien/quien-con-quien.component';
import { RendimientoPuestosComponent } from '../../components/rendimiento-puestos/rendimiento-puestos.component';
import { DatosEstadisticasService } from '../../services/datos-estadisticas.service';
import { TemaGraficasService } from '../../services/tema-graficas.service';
import { echarts } from '../../utils/echarts-configurado';

/**
 * Estadísticas del equipo: jornada a jornada, por partido, quién con quién y parejas más
 * repetidas para todos; respuestas y participación solo para los gestores. ECharts se
 * carga solo con esta página.
 */
@Component({
  selector: 'ctp-estadisticas-page',
  imports: [
    IconoComponent,
    MensajeEstadoComponent,
    CuadriculaJornadasComponent,
    FiltroFaseComponent,
    ParejasRepetidasComponent,
    ParticipacionEquipoComponent,
    QuienConQuienComponent,
    RendimientoPuestosComponent,
  ],
  providers: [DatosEstadisticasService, TemaGraficasService, provideEchartsCore({ echarts })],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstadisticasPageComponent {
  protected readonly datos = inject(DatosEstadisticasService);
}
