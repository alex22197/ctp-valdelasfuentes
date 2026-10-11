import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SeccionReglamentoComponent } from '../seccion-reglamento/seccion-reglamento.component';

/** Reglamento: fases y calendario de la temporada, Masters, premios y quién decide. */
@Component({
  selector: 'ctp-reglas-temporada',
  imports: [SeccionReglamentoComponent],
  templateUrl: './reglas-temporada.component.html',
  styleUrl: './reglas-temporada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglasTemporadaComponent {}
