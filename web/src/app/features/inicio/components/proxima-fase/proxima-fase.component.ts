import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { describirFechaCorta } from '@shared/utils/fechas';

/**
 * La tarjeta verde de la portada cuando la fase que viene todavía no tiene partido (los retos
 * hasta que la liga publica el cruce): qué fase es, cuándo empieza y que falta el rival.
 */
@Component({
  selector: 'ctp-proxima-fase',
  imports: [IconoComponent],
  templateUrl: './proxima-fase.component.html',
  styleUrl: './proxima-fase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProximaFaseComponent {
  readonly fase = input.required<Fase>();

  /** «Fin de semana del 7 de noviembre» o «Fecha por confirmar». */
  protected readonly cuando = computed(() => {
    const texto = describirFechaCorta(null, this.fase().inicio);
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  });
}
