import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CabeceraFaseComponent } from '@shared/components/cabecera-fase/cabecera-fase.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { TablaClasificacionComponent } from '@shared/components/tabla-clasificacion/tabla-clasificacion.component';
import { JornadasGrupoComponent } from '../../components/jornadas-grupo/jornadas-grupo.component';
import { DatosClasificacionService } from '../../services/datos-clasificacion.service';

/**
 * Clasificación oficial de cada fase de liga de la temporada, la que se juega primero y
 * después las terminadas, cada una con los resultados de todas las jornadas de su grupo.
 */
@Component({
  selector: 'ctp-clasificacion-page',
  imports: [
    CabeceraFaseComponent,
    MensajeEstadoComponent,
    TablaClasificacionComponent,
    JornadasGrupoComponent,
  ],
  providers: [DatosClasificacionService],
  templateUrl: './clasificacion-page.component.html',
  styleUrl: './clasificacion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClasificacionPageComponent {
  protected readonly datos = inject(DatosClasificacionService);
}
