import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { DatosJornadaComponent } from '@shared/components/datos-jornada/datos-jornada.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { CabeceraFaseComponent } from '@shared/components/cabecera-fase/cabecera-fase.component';
import { JornadaGestionComponent } from '../../components/jornada-gestion/jornada-gestion.component';
import { LecturaLigaComponent } from '../../components/lectura-liga/lectura-liga.component';
import { CuentasNuevasComponent } from '../../components/cuentas-nuevas/cuentas-nuevas.component';
import { ListaGestoresComponent } from '../../components/lista-gestores/lista-gestores.component';
import { DatosGestionService } from '../../services/datos-gestion.service';
import { GestoresGestionService } from '../../services/gestores-gestion.service';

/**
 * Punto de partida de los gestores: la próxima jornada con su convocatoria, los resultados
 * que faltan por meter y todas las jornadas de la fase. Arriba, cómo fue la última lectura de
 * la web de la liga. El administrador ve además quién gestiona el equipo y da o quita permisos.
 */
@Component({
  selector: 'ctp-gestion-page',
  imports: [
    RouterLink,
    CabeceraFaseComponent,
    DatosJornadaComponent,
    MensajeEstadoComponent,
    JornadaGestionComponent,
    LecturaLigaComponent,
    ListaGestoresComponent,
    CuentasNuevasComponent,
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
