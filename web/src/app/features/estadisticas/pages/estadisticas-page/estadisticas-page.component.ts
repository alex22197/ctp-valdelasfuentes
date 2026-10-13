import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideEchartsCore } from 'ngx-echarts';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import { echarts } from '@shared/utils/graficas/echarts-configurado';
import { BarraResaltadoComponent } from '../../components/barra-resaltado/barra-resaltado.component';
import { CuadriculaJornadasComponent } from '../../components/cuadricula-jornadas/cuadricula-jornadas.component';
import { EvolucionTemporadaComponent } from '../../components/evolucion-temporada/evolucion-temporada.component';
import { FiltroFaseComponent } from '../../components/filtro-fase/filtro-fase.component';
import { ParejasRepetidasComponent } from '../../components/parejas-repetidas/parejas-repetidas.component';
import { QuienConQuienComponent } from '../../components/quien-con-quien/quien-con-quien.component';
import { RankingJugadoresComponent } from '../../components/ranking-jugadores/ranking-jugadores.component';
import { RendimientoPuestosComponent } from '../../components/rendimiento-puestos/rendimiento-puestos.component';
import { RevesDriveComponent } from '../../components/reves-drive/reves-drive.component';
import { DatosEstadisticasService } from '../../services/datos-estadisticas.service';

/**
 * Estadísticas del equipo: evolución, jornada a jornada, por partido, ranking, revés contra
 * drive, quién con quién y parejas más repetidas. Tocar a un jugador lo resalta en todas
 * las gráficas. ECharts se carga solo con esta página.
 */
@Component({
  selector: 'ctp-estadisticas-page',
  imports: [
    MensajeEstadoComponent,
    BarraResaltadoComponent,
    CuadriculaJornadasComponent,
    EvolucionTemporadaComponent,
    FiltroFaseComponent,
    ParejasRepetidasComponent,
    QuienConQuienComponent,
    RankingJugadoresComponent,
    RendimientoPuestosComponent,
    RevesDriveComponent,
  ],
  providers: [DatosEstadisticasService, TemaGraficasService, provideEchartsCore({ echarts })],
  templateUrl: './estadisticas-page.component.html',
  styleUrl: './estadisticas-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.con-resaltado]': 'datos.resaltado() !== null' },
})
export class EstadisticasPageComponent {
  protected readonly datos = inject(DatosEstadisticasService);
}
