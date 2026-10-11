import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { FilaPlantilla } from '../../interfaces/fila-plantilla.interface';

/** Jugadores como fichas con sus iniciales y su balance; cada una lleva a su ficha. */
@Component({
  selector: 'ctp-lista-plantilla',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './lista-plantilla.component.html',
  styleUrl: './lista-plantilla.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPlantillaComponent {
  readonly filas = input.required<readonly FilaPlantilla[]>();
  /** Sin enlace (los comodines para los visitantes), la ficha se muestra sin poder tocarla. */
  readonly enlazar = input(true);
}
