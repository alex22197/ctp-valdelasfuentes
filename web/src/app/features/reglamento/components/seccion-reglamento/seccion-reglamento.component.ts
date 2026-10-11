import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

/**
 * Una sección desplegable del reglamento: título, «en corto» y el detalle. Se abre sola si
 * la dirección apunta a ella (`/reglamento#wo`), para que un enlace pegado en WhatsApp lleve
 * directamente a la regla.
 */
@Component({
  selector: 'ctp-seccion-reglamento',
  templateUrl: './seccion-reglamento.component.html',
  styleUrl: './seccion-reglamento.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeccionReglamentoComponent {
  /** Ancla de la sección en la dirección: `wo` para `/reglamento#wo`. */
  readonly ancla = input.required<string>();
  readonly titulo = input.required<string>();
  /** Resumen en una frase, visible antes de abrirla. */
  readonly enCorto = input.required<string>();

  private readonly fragmento = toSignal(inject(ActivatedRoute).fragment);
  protected readonly abierta = computed(() => this.fragmento() === this.ancla());
}
