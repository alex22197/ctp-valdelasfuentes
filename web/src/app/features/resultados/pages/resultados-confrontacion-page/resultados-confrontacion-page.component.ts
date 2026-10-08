import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { ResultadoPartidoComponent } from '../../components/resultado-partido/resultado-partido.component';
import { DatosResultadosService } from '../../services/datos-resultados.service';
import { clavePartido } from '../../utils/formulario-resultado';

/** Resultados de los partidos de una confrontación, para meterlos nada más jugar. Solo gestores. */
@Component({
  selector: 'ctp-resultados-confrontacion-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    FechaConfrontacionPipe,
    ResultadoPartidoComponent,
  ],
  providers: [DatosResultadosService],
  templateUrl: './resultados-confrontacion-page.component.html',
  styleUrl: './resultados-confrontacion-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadosConfrontacionPageComponent {
  protected readonly datos = inject(DatosResultadosService);
  protected readonly clavePartido = clavePartido;
}
