import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PartidoAlineacion } from '@data-access/alineaciones/interfaces/partido-alineacion.interface';
import { PistaAlineacionComponent } from '@shared/components/pista-alineacion/pista-alineacion.component';
import { etiquetaPartido } from '@shared/utils/etiquetas-partido';

/** Las parejas de una jornada, cada una sobre su pista. */
@Component({
  selector: 'ctp-convocatoria-jornada',
  imports: [PistaAlineacionComponent],
  templateUrl: './convocatoria-jornada.component.html',
  styleUrl: './convocatoria-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaJornadaComponent {
  readonly partidos = input.required<readonly PartidoAlineacion[]>();

  protected readonly etiquetaPartido = etiquetaPartido;
}
