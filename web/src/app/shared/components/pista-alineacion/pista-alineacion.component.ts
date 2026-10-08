import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { VariantePista } from './interfaces/variante-pista.type';

/**
 * Media pista vista desde arriba, con la red al fondo: el jugador de revés a la izquierda
 * y el de drive a la derecha, como lo escribe el capitán en la convocatoria.
 */
@Component({
  selector: 'ctp-pista-alineacion',
  templateUrl: './pista-alineacion.component.html',
  styleUrl: './pista-alineacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.mixto]': "variante() === 'mixto'" },
})
export class PistaAlineacionComponent {
  readonly titulo = input.required<string>();
  readonly jugadorReves = input<string | null>(null);
  readonly jugadorDrive = input<string | null>(null);
  readonly variante = input<VariantePista>('normal');
}
