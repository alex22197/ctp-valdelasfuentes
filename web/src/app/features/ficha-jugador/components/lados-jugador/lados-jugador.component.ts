import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { BalanceLado } from '@data-access/estadisticas/interfaces/balance-lado.interface';

const SIN_PARTIDOS = { partidos: 0, ganados: 0, perdidos: 0, porcentajeVictorias: null };

/** Media pista partida en revés y drive, con los partidos y victorias en cada lado. */
@Component({
  selector: 'ctp-lados-jugador',
  templateUrl: './lados-jugador.component.html',
  styleUrl: './lados-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LadosJugadorComponent {
  readonly lados = input.required<readonly BalanceLado[]>();

  /** Siempre los dos lados, revés a la izquierda, aunque en uno no haya jugado. */
  protected readonly mitades = computed(() =>
    (['reves', 'drive'] as const).map((lado: Lado) => ({
      lado,
      nombre: lado === 'reves' ? 'Revés' : 'Drive',
      ...(this.lados().find((b) => b.lado === lado) ?? SIN_PARTIDOS),
    })),
  );
}
