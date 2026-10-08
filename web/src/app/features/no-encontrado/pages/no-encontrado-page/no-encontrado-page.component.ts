import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Se muestra con cualquier dirección que no corresponda a una página. */
@Component({
  selector: 'ctp-no-encontrado-page',
  imports: [RouterLink],
  templateUrl: './no-encontrado-page.component.html',
  styleUrl: './no-encontrado-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NoEncontradoPageComponent {}
