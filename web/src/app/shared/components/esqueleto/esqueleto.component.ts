import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FormaEsqueleto } from './interfaces/forma-esqueleto.type';

/** Alto de cada barra en una gráfica que aún no ha llegado, en %. */
const ALTOS_GRAFICA = [45, 80, 30, 65, 50, 70];
/** Largo de cada barra del ranking, de más a menos, en %. */
const LARGOS_RANKING = [95, 85, 76, 68, 57, 46, 35];

/**
 * Hueco gris con la forma del contenido que está cargando (una tabla, tarjetas de
 * jugadores, una gráfica…), para que la página no salte cuando llega. Solo es visual.
 */
@Component({
  selector: 'ctp-esqueleto',
  imports: [NgTemplateOutlet],
  templateUrl: './esqueleto.component.html',
  styleUrl: './esqueleto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true' },
})
export class EsqueletoComponent {
  readonly forma = input.required<FormaEsqueleto>();

  protected readonly altosGrafica = ALTOS_GRAFICA;
  protected readonly largosRanking = LARGOS_RANKING;
  protected readonly seis = [1, 2, 3, 4, 5, 6];
  protected readonly ocho = [1, 2, 3, 4, 5, 6, 7, 8];
  protected readonly casillas = Array.from({ length: 36 }, (_, i) => i);
}
