import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { etiquetaSinJornada } from '@data-access/competiciones/estado-fase';
import type { TipoFase } from '@data-access/competiciones/interfaces/tipo-fase.type';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';

/**
 * Lista de jornadas de nuestro equipo en una fase, con rival, fecha y resultado. En las
 * eliminatorias, que no tienen número de jornada, va su nombre corto («Reto») en su lugar.
 */
@Component({
  selector: 'ctp-calendario-fase',
  imports: [RouterLink, MensajeEstadoComponent, FechaConfrontacionPipe],
  templateUrl: './calendario-fase.component.html',
  styleUrl: './calendario-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioFaseComponent {
  readonly confrontaciones = input.required<readonly ConfrontacionNuestroEquipo[]>();
  /** Muestra en cada jornada los enlaces de gestión: convocatoria y resultados. */
  readonly enlacesGestion = input(false);
  /** El tipo de la fase, para nombrar las confrontaciones sin número de jornada. */
  readonly tipoFase = input<TipoFase>('apertura');
  readonly textoVacio = input('El calendario de esta fase todavía no está publicado.');

  /** «Reto», «Play-off»… o una raya si una jornada de liga no tiene número. */
  protected readonly sinNumero = computed(() => etiquetaSinJornada(this.tipoFase()) ?? '–');
}
