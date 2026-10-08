import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { setConTiebreak } from '@data-access/resultados/validar-marcador';
import type { SetFormulario } from '../../interfaces/set-formulario.interface';

let siguienteId = 0;

/**
 * Juegos de un set para cada pareja. Si el set acaba 7-6 aparecen los puntos del
 * tie-break. Muestra debajo el error de ese set, si lo hay.
 */
@Component({
  selector: 'ctp-campo-set',
  templateUrl: './campo-set.component.html',
  styleUrl: './campo-set.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampoSetComponent {
  readonly numeroSet = input.required<number>();
  readonly valor = model.required<SetFormulario>();
  readonly error = input<string | null>(null);

  protected readonly idError = `error-set-${++siguienteId}`;

  protected readonly hayTiebreak = computed(() => {
    const { juegosNuestros, juegosRival } = this.valor();
    return setConTiebreak(Number(juegosNuestros), Number(juegosRival));
  });

  protected cambiar(campo: keyof SetFormulario, evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.valor.update((valor) => ({ ...valor, [campo]: texto }));
  }
}
