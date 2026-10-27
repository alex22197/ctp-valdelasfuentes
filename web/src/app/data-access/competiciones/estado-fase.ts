import type { EstadoFase } from './interfaces/estado-fase.type';
import type { Fase } from './interfaces/fase.interface';
import type { TipoFase } from './interfaces/tipo-fase.type';

/** Si una fase ya terminó, es la que se juega o viene después, según su orden. */
export function estadoFase(fase: Fase, actual: Fase | null): EstadoFase {
  if (!actual || fase.orden === actual.orden) {
    return 'en-juego';
  }
  return fase.orden < actual.orden ? 'terminada' : 'proxima';
}

const ETIQUETA_CORTA: Record<TipoFase, string | null> = {
  apertura: null,
  clausura: null,
  retos: 'Reto',
  previa_playoff: 'Previa',
  playoff: 'Play-off',
  masters: 'Masters',
};

/**
 * Lo que va en lugar de «J3» en una confrontación sin número de jornada: «Reto», «Play-off»…
 * `null` en las fases de liga, que siempre llevan número.
 */
export function etiquetaSinJornada(tipo: TipoFase): string | null {
  return ETIQUETA_CORTA[tipo];
}
