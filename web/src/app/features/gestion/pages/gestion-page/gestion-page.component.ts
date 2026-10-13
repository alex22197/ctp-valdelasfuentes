import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { JornadaGestionComponent } from '../../components/jornada-gestion/jornada-gestion.component';
import { DatosGestionService } from '../../services/datos-gestion.service';

/**
 * Punto de partida de los gestores: la próxima jornada con su convocatoria, los resultados
 * que faltan por meter y todas las jornadas de la fase.
 */
@Component({
  selector: 'ctp-gestion-page',
  imports: [MensajeEstadoComponent, JornadaGestionComponent],
  providers: [DatosGestionService],
  templateUrl: './gestion-page.component.html',
  styleUrl: './gestion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionPageComponent {
  protected readonly datos = inject(DatosGestionService);
}
