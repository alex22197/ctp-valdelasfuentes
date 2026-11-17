import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';

/**
 * El lado preferido se elige tocando media pista: revés a la izquierda, drive a la derecha,
 * como en las alineaciones. Tocar el lado ya elegido lo quita (juega igual de los dos).
 */
@Component({
  selector: 'ctp-selector-lado',
  templateUrl: './selector-lado.component.html',
  styleUrl: './selector-lado.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorLadoComponent {
  readonly valor = model<Lado | null>(null);

  protected elegir(lado: Lado): void {
    this.valor.set(this.valor() === lado ? null : lado);
  }
}
