import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '@core/auth/auth.service';
import { DatosJornadaComponent } from '@shared/components/datos-jornada/datos-jornada.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { JornadaGestionComponent } from '../../components/jornada-gestion/jornada-gestion.component';
import { ListaGestoresComponent } from '../../components/lista-gestores/lista-gestores.component';
import { DatosGestionService } from '../../services/datos-gestion.service';
import { GestoresGestionService } from '../../services/gestores-gestion.service';

/**
 * Punto de partida de los gestores: la próxima jornada con su convocatoria, los resultados
 * que faltan por meter y todas las jornadas de la fase. El administrador ve además quién
 * gestiona el equipo y da o quita permisos.
 */
@Component({
  selector: 'ctp-gestion-page',
  imports: [
    DatosJornadaComponent,
    MensajeEstadoComponent,
    JornadaGestionComponent,
    ListaGestoresComponent,
  ],
  providers: [DatosGestionService, GestoresGestionService],
  templateUrl: './gestion-page.component.html',
  styleUrl: './gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionPageComponent {
  protected readonly datos = inject(DatosGestionService);
  protected readonly auth = inject(AuthService);
  protected readonly gestores = inject(GestoresGestionService);
}
