import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { JugadorAlineado } from '@data-access/alineaciones/interfaces/jugador-alineado.interface';
import type { PartidoAlineacion } from '@data-access/alineaciones/interfaces/partido-alineacion.interface';
import { PistaAlineacionComponent } from '@shared/components/pista-alineacion/pista-alineacion.component';
import { etiquetaPartido } from '@shared/utils/etiquetas-partido';

/** Las parejas de una jornada, cada una sobre su pista, con enlace a la ficha de cada uno. */
@Component({
  selector: 'ctp-convocatoria-jornada',
  imports: [PistaAlineacionComponent],
  templateUrl: './convocatoria-jornada.component.html',
  styleUrl: './convocatoria-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaJornadaComponent {
  readonly partidos = input.required<readonly PartidoAlineacion[]>();
  /** Los comodines no tienen ficha pública, así que su nombre no lleva enlace. */
  readonly idsComodines = input<ReadonlySet<string>>(new Set());

  protected readonly etiquetaPartido = etiquetaPartido;

  protected enlaceFicha(jugador: JugadorAlineado | null): string | null {
    return jugador && !this.idsComodines().has(jugador.id) ? `/jugadores/${jugador.id}` : null;
  }
}
