import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { FaseTemporada } from '../../interfaces/fase-temporada.interface';
import type { ResultadoEnJornada } from '../../interfaces/resultado-en-jornada.type';

const LETRA: Record<ResultadoEnJornada, string> = { ganado: 'G', perdido: 'P', 'no-jugo': '' };
const TEXTO: Record<ResultadoEnJornada, string> = {
  ganado: 'Ganado',
  perdido: 'Perdido',
  'no-jugo': 'No jugó',
};

/** Una fila por jornada con G, P o vacío, el rival, con quién y en qué lado, y los sets. */
@Component({
  selector: 'ctp-temporada-jugador',
  templateUrl: './temporada-jugador.component.html',
  styleUrl: './temporada-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemporadaJugadorComponent {
  readonly fases = input.required<readonly FaseTemporada[]>();

  protected readonly letra = LETRA;
  protected readonly texto = TEXTO;
}
