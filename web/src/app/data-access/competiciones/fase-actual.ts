import type { Fase } from './interfaces/fase.interface';

/**
 * Elige la fase en curso: la última que ya ha empezado. Si ninguna ha empezado todavía,
 * la primera. `hoyIso` va en formato AAAA-MM-DD.
 */
export function elegirFaseActual(fases: readonly Fase[], hoyIso: string): Fase | null {
  const ordenadas = [...fases].sort((a, b) => a.orden - b.orden);
  const empezadas = ordenadas.filter((fase) => fase.inicio !== null && fase.inicio <= hoyIso);
  return empezadas.at(-1) ?? ordenadas[0] ?? null;
}
