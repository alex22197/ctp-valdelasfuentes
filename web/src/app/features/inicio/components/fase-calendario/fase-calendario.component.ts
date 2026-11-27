import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import { estaPorJugar } from '@data-access/confrontaciones/estado-jornada';
import type { CalendarioDeFase } from '@data-access/confrontaciones/interfaces/calendario-de-fase.interface';
import { balanceDe, describirBalance } from '@data-access/confrontaciones/resultado-confrontacion';
import { CabeceraFaseComponent } from '@shared/components/cabecera-fase/cabecera-fase.component';
import { CalendarioFaseComponent } from '../calendario-fase/calendario-fase.component';

/**
 * Una fase en el calendario de la portada, con su cabecera y sus jornadas. Las fases que ya
 * terminaron salen plegadas, con su balance («1 victoria, 2 derrotas»), para que lo que se ve
 * sin tocar nada sea lo que se está jugando.
 */
@Component({
  selector: 'ctp-fase-calendario',
  imports: [NgTemplateOutlet, CabeceraFaseComponent, CalendarioFaseComponent],
  templateUrl: './fase-calendario.component.html',
  styleUrl: './fase-calendario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaseCalendarioComponent {
  readonly calendario = input.required<CalendarioDeFase>();
  readonly estado = input.required<EstadoFase>();
  readonly enlacesGestion = input(false);
  /** El próximo partido del equipo, para destacarlo si es de esta fase. */
  readonly idProxima = input<string | null>(null);

  /** Terminada y sin nada pendiente: una aplazada de una fase anterior la deja abierta. */
  protected readonly plegada = computed(
    () =>
      this.estado() === 'terminada' &&
      this.calendario().confrontaciones.every((jornada) => !estaPorJugar(jornada.estado)),
  );

  protected readonly balance = computed(() =>
    describirBalance(balanceDe(this.calendario().confrontaciones)),
  );
}
