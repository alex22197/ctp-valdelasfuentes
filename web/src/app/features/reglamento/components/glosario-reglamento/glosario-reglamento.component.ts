import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Glosario del reglamento: los términos que salen en la normativa, en palabras sencillas. */
@Component({
  selector: 'ctp-glosario-reglamento',
  templateUrl: './glosario-reglamento.component.html',
  styleUrl: './glosario-reglamento.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlosarioReglamentoComponent {}
