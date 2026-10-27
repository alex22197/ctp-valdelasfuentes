import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';

const TEXTO_ESTADO: Record<EstadoFase, string> = {
  terminada: 'Terminada',
  'en-juego': 'En juego',
  proxima: 'Próxima',
};

/**
 * El nombre de una fase encima de sus jornadas, con una etiqueta que dice si ya terminó, es la
 * que se juega o viene después. Separa las fases en el calendario de toda la temporada.
 */
@Component({
  selector: 'ctp-cabecera-fase',
  templateUrl: './cabecera-fase.component.html',
  styleUrl: './cabecera-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabeceraFaseComponent {
  readonly fase = input.required<Fase>();
  readonly estado = input.required<EstadoFase>();

  protected readonly textoEstado = TEXTO_ESTADO;
}
