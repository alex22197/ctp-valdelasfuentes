import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeccionReglamentoComponent } from '../seccion-reglamento/seccion-reglamento.component';

/** Reglamento: lluvia, aplazamientos, partidos suspendidos, acta y reclamaciones. */
@Component({
  selector: 'ctp-reglas-incidencias',
  imports: [RouterLink, SeccionReglamentoComponent],
  templateUrl: './reglas-incidencias.component.html',
  styleUrl: './reglas-incidencias.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglasIncidenciasComponent {}
