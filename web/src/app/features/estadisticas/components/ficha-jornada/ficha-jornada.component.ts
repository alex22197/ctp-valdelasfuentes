import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { EstadoCasilla } from '../../interfaces/estado-casilla.type';
import type { FilaCuadricula } from '../../interfaces/fila-cuadricula.interface';
import { SIMBOLO_ESTADO } from '../../utils/simbolo-estado';
import { TiraJornadaComponent } from '../tira-jornada/tira-jornada.component';

/**
 * Una jornada de un vistazo: rival, marcador, puntos y una tira con el resultado de cada
 * partido agrupado por categoría. Al abrirla, cada partido con su pareja y sus sets.
 * Ganado y perdido se distinguen también sin color: ✓, ✕ y relleno o borde.
 */
@Component({
  selector: 'ctp-ficha-jornada',
  imports: [TiraJornadaComponent],
  templateUrl: './ficha-jornada.component.html',
  styleUrl: './ficha-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FichaJornadaComponent {
  readonly fila = input.required<FilaCuadricula>();
  /** Si sale abierta, con el detalle de cada partido a la vista. */
  readonly abierta = input(false);

  protected readonly simbolo = SIMBOLO_ESTADO;

  protected readonly textoEstado: Record<EstadoCasilla, string> = {
    ganado: 'Ganado',
    perdido: 'Perdido',
    pendiente: 'Por jugar',
  };

  /** «3 partidos ganados y 3 perdidos»: lo que la tira dice con dibujos. */
  protected readonly resumen = computed(() => {
    const casillas = this.fila().grupos.flatMap((grupo) => grupo.casillas);
    const ganados = casillas.filter((c) => c.estado === 'ganado').length;
    const perdidos = casillas.filter((c) => c.estado === 'perdido').length;
    return `${ganados} ${ganados === 1 ? 'partido ganado' : 'partidos ganados'} y ${perdidos} ${perdidos === 1 ? 'perdido' : 'perdidos'}`;
  });
}
