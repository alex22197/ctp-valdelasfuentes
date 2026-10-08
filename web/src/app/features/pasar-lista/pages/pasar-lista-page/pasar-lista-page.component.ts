import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { GrupoEncuestaComponent } from '../../components/grupo-encuesta/grupo-encuesta.component';
import { RecuentoEncuestaComponent } from '../../components/recuento-encuesta/recuento-encuesta.component';
import { DatosPasarListaService } from '../../services/datos-pasar-lista.service';

/**
 * «Pasar lista»: el gestor copia aquí lo que cada jugador respondió a la encuesta de
 * WhatsApp, con un toque por persona. Solo gestores; las respuestas son privadas.
 */
@Component({
  selector: 'ctp-pasar-lista-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    FechaConfrontacionPipe,
    GrupoEncuestaComponent,
    RecuentoEncuestaComponent,
  ],
  providers: [DatosPasarListaService],
  templateUrl: './pasar-lista-page.component.html',
  styleUrl: './pasar-lista-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasarListaPageComponent {
  protected readonly datos = inject(DatosPasarListaService);
}
