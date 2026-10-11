import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeccionReglamentoComponent } from '../seccion-reglamento/seccion-reglamento.component';

/** Reglamento: cómo es una jornada, quién puede jugar, la alineación y cada partido. */
@Component({
  selector: 'ctp-reglas-jornada',
  imports: [RouterLink, SeccionReglamentoComponent],
  templateUrl: './reglas-jornada.component.html',
  styleUrl: './reglas-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglasJornadaComponent {}
