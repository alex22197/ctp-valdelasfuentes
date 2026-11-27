import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';

const TEXTO_ESTADO: Record<EstadoFase, string> = {
  terminada: 'Terminada',
  'en-juego': 'En juego',
  proxima: 'Próxima',
};

/**
 * El nombre de una fase encima de sus jornadas o de su clasificación, con una etiqueta que dice
 * si ya terminó, es la que se juega o viene después. `nivel` es el del título: 3 bajo una
 * sección (el calendario de la portada) y 2 directamente bajo el título de la página.
 */
@Component({
  selector: 'ctp-cabecera-fase',
  imports: [NgTemplateOutlet],
  templateUrl: './cabecera-fase.component.html',
  styleUrl: './cabecera-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabeceraFaseComponent {
  readonly fase = input.required<Fase>();
  readonly estado = input.required<EstadoFase>();
  readonly nivel = input<2 | 3>(3);
  /** Sin la etiqueta del estado, para cuando ya lo dice quien la usa (una fase plegada). */
  readonly conEstado = input(true);

  protected readonly textoEstado = TEXTO_ESTADO;
}
