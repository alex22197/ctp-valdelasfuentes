import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { etiquetaSinJornada } from '@data-access/competiciones/estado-fase';
import type { TipoFase } from '@data-access/competiciones/interfaces/tipo-fase.type';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { repartirJornadas } from '@data-access/confrontaciones/repartir-jornadas';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import { FilaCalendarioComponent } from '../fila-calendario/fila-calendario.component';

/**
 * Las jornadas de nuestro equipo en una fase, en el orden en que interesan: primero lo que
 * queda por jugar, de lo más cercano a lo más lejano, y después lo jugado, de lo más reciente
 * a lo más antiguo. Si hay de las dos cosas, cada parte lleva su rótulo.
 */
@Component({
  selector: 'ctp-calendario-fase',
  imports: [MensajeEstadoComponent, FilaCalendarioComponent],
  templateUrl: './calendario-fase.component.html',
  styleUrl: './calendario-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarioFaseComponent {
  readonly confrontaciones = input.required<readonly ConfrontacionNuestroEquipo[]>();
  /** Muestra en cada jornada los enlaces de gestión que toquen. */
  readonly enlacesGestion = input(false);
  /** El tipo de la fase, para nombrar las confrontaciones sin número de jornada. */
  readonly tipoFase = input<TipoFase>('apertura');
  /** El próximo partido del equipo, que se destaca; `null` si no está en esta lista. */
  readonly idProxima = input<string | null>(null);
  readonly textoVacio = input('El calendario de esta fase todavía no está publicado.');
  /** Hoy en Madrid (AAAA-MM-DD). */
  readonly hoy = input(fechaIsoEnMadrid(new Date()));

  /** «Reto», «Play-off»… o una raya si una jornada de liga no tiene número. */
  protected readonly sinNumero = computed(() => etiquetaSinJornada(this.tipoFase()) ?? '–');

  protected readonly repartidas = computed(() =>
    repartirJornadas(this.confrontaciones(), this.hoy()),
  );

  /** Los rótulos solo hacen falta para distinguir las dos partes. */
  protected readonly conRotulos = computed(() => {
    const { porJugar, disputadas } = this.repartidas();
    return porJugar.length > 0 && disputadas.length > 0;
  });
}
