import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { CompanerosJugadorComponent } from '../../components/companeros-jugador/companeros-jugador.component';
import { LadosJugadorComponent } from '../../components/lados-jugador/lados-jugador.component';
import { MarcadorJugadorComponent } from '../../components/marcador-jugador/marcador-jugador.component';
import { PuestosJugadorComponent } from '../../components/puestos-jugador/puestos-jugador.component';
import { TemporadaJugadorComponent } from '../../components/temporada-jugador/temporada-jugador.component';
import { DatosFichaJugadorService } from '../../services/datos-ficha-jugador.service';
import { describirJugador } from '../../utils/describir-jugador';

/** Ficha pública de un jugador con su temporada. Los comodines solo los ven los gestores. */
@Component({
  selector: 'ctp-ficha-jugador-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    CompanerosJugadorComponent,
    LadosJugadorComponent,
    MarcadorJugadorComponent,
    PuestosJugadorComponent,
    TemporadaJugadorComponent,
  ],
  providers: [DatosFichaJugadorService],
  templateUrl: './ficha-jugador-page.component.html',
  styleUrl: './ficha-jugador-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FichaJugadorPageComponent {
  protected readonly datos = inject(DatosFichaJugadorService);

  protected readonly descripcion = computed(() => {
    const jugador = this.datos.jugador();
    return jugador ? describirJugador(jugador.sexo, this.datos.lado()) : '';
  });
}
