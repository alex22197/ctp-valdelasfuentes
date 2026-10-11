import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import type { OpcionPildora } from '../../interfaces/opcion-pildora.interface';

/** Grupo de píldoras para elegir una opción: chicos o chicas, cómo ordenar… */
@Component({
  selector: 'ctp-selector-pildoras',
  templateUrl: './selector-pildoras.component.html',
  styleUrl: './selector-pildoras.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorPildorasComponent<T> {
  readonly opciones = input.required<readonly OpcionPildora<T>[]>();
  /** Nombre del grupo para los lectores de pantalla. */
  readonly nombre = input.required<string>();
  readonly valor = model.required<T>();
}
