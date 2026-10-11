import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeccionReglamentoComponent } from '../seccion-reglamento/seccion-reglamento.component';

/** Reglamento: puntos, desempates de la clasificación y WO. */
@Component({
  selector: 'ctp-reglas-puntos',
  imports: [RouterLink, SeccionReglamentoComponent],
  templateUrl: './reglas-puntos.component.html',
  styleUrl: './reglas-puntos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglasPuntosComponent {}
