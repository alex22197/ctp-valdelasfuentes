import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { QuimicaPareja } from '../../interfaces/quimica-pareja.interface';
import { MINIMO_PARTIDOS_QUIMICA, signoQuimica } from '../../utils/quimica-parejas';

const NOMBRE_TIPO = { masculino: 'Masculino', femenino: 'Femenino', mixto: 'Mixto' } as const;

/**
 * Química de cada pareja: una barra que sale del centro, a la derecha en verde si la pareja
 * gana más junta que sus jugadores por separado y a la izquierda en rojo si gana menos.
 */
@Component({
  selector: 'ctp-quimica-parejas',
  templateUrl: './quimica-parejas.component.html',
  styleUrl: './quimica-parejas.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuimicaParejasComponent {
  /** Llegan ordenadas de la que más suma a la que más resta. */
  readonly parejas = input.required<readonly QuimicaPareja[]>();
  /** Con un jugador resaltado, las parejas en las que no está se atenúan. */
  readonly idResaltado = input<string | null>(null);

  protected readonly nombreTipo = NOMBRE_TIPO;
  protected readonly minimo = MINIMO_PARTIDOS_QUIMICA;
  protected readonly signo = signoQuimica;

  /** La barra ocupa, como mucho, media escala a cada lado: 100 puntos son el ancho entero. */
  protected ancho(quimica: number): number {
    return Math.min(50, Math.abs(quimica) / 2);
  }

  protected atenuada(pareja: QuimicaPareja): boolean {
    const id = this.idResaltado();
    return id !== null && pareja.pareja.jugadorA.id !== id && pareja.pareja.jugadorB.id !== id;
  }
}
