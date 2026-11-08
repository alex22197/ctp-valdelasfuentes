import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { SetFormulario } from '../../interfaces/set-formulario.interface';

let siguienteId = 0;

/**
 * Juegos de un set para cada pareja; en un 7-6 no hace falta apuntar el tie-break. Muestra
 * debajo el error de ese set, si lo hay.
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

  protected cambiar(campo: keyof SetFormulario, evento: Event): void {
    const texto = (evento.target as HTMLInputElement).value;
    this.valor.update((valor) => ({ ...valor, [campo]: texto }));
  }
}
