import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';
import { CalendarioFaseComponent } from '../../components/calendario-fase/calendario-fase.component';
import { ConvocatoriaJornadaComponent } from '../../components/convocatoria-jornada/convocatoria-jornada.component';
import { ProximoPartidoComponent } from '../../components/proximo-partido/proximo-partido.component';
import { DatosInicioService } from '../../services/datos-inicio.service';

/** Portada: próximo partido, su convocatoria, la clasificación y el calendario. */
@Component({
  selector: 'ctp-inicio-page',
  imports: [
    RouterLink,
    MensajeEstadoComponent,
    TablaClasificacionComponent,
    CalendarioFaseComponent,
    ConvocatoriaJornadaComponent,
    ProximoPartidoComponent,
  ],
  providers: [DatosInicioService],
  templateUrl: './inicio-page.component.html',
  styleUrl: './inicio-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioPageComponent {
  protected readonly datos = inject(DatosInicioService);
  protected readonly auth = inject(AuthService);
}
