import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';

/** Píldoras para elegir «Toda la liga» o una de sus fases. */
@Component({
  selector: 'ctp-filtro-fase',
  templateUrl: './filtro-fase.component.html',
  styleUrl: './filtro-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiltroFaseComponent {
  readonly fases = input.required<readonly Fase[]>();
  /** Fase elegida; `null` es toda la liga. */
  readonly seleccion = model<string | null>(null);
}
