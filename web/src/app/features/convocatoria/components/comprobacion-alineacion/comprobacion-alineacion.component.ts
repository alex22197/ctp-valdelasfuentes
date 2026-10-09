import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { ProblemaAlineacion } from '../../interfaces/problema-alineacion.interface';

/**
 * Resumen de la comprobación de normativa: «Cumple la normativa» o la lista de errores
 * (impiden guardar) y avisos (conviene revisarlos, pero no lo impiden).
 */
@Component({
  selector: 'ctp-comprobacion-alineacion',
  templateUrl: './comprobacion-alineacion.component.html',
  styleUrl: './comprobacion-alineacion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComprobacionAlineacionComponent {
  readonly problemas = input.required<readonly ProblemaAlineacion[]>();

  protected readonly errores = computed(() =>
    this.problemas().filter((problema) => problema.gravedad === 'error'),
  );
  protected readonly avisos = computed(() =>
    this.problemas().filter((problema) => problema.gravedad === 'aviso'),
  );
}
