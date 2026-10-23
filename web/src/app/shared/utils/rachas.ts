import type { Racha } from './interfaces/racha.interface';

/**
 * La racha actual a partir de los resultados en orden de juego (`true`, ganado): cuántos
 * seguidos iguales al último. `null` sin partidos.
 */
export function calcularRacha(ganados: readonly boolean[]): Racha | null {
  const ultimo = ganados.at(-1);
  if (ultimo === undefined) {
    return null;
  }
  let largo = 0;
  for (let i = ganados.length - 1; i >= 0 && ganados[i] === ultimo; i--) {
    largo++;
  }
  return { tipo: ultimo ? 'victorias' : 'derrotas', largo };
}

/** «3 victorias seguidas», «2 derrotas seguidas» o, si solo es una, «Última: victoria». */
export function describirRacha(racha: Racha | null): string {
  if (!racha) {
    return 'Sin partidos';
  }
  if (racha.largo >= 2) {
    return `${racha.largo} ${racha.tipo} seguidas`;
  }
  return `Última: ${racha.tipo === 'victorias' ? 'victoria' : 'derrota'}`;
}
