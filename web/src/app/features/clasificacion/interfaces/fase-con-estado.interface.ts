import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';

/** Una fase de liga y si ya terminó, se juega o viene después. */
export interface FaseConEstado {
  readonly fase: Fase;
  readonly estado: EstadoFase;
}
