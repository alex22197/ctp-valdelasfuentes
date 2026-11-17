import { estadoFase } from '@data-access/competiciones/estado-fase';
import { TIPOS_CON_CLASIFICACION, elegirFaseActual } from '@data-access/competiciones/fase-actual';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import type { FaseConEstado } from '../interfaces/fase-con-estado.interface';

/**
 * Las fases de la temporada que tienen clasificación (las ligas: apertura y clausura), de la
 * más reciente a la más antigua y con su estado respecto a la fase en curso. Las eliminatorias
 * no salen: no tienen clasificación. `hoyIso` va en AAAA-MM-DD.
 */
export function fasesConClasificacion(fases: readonly Fase[], hoyIso: string): FaseConEstado[] {
  const actual = elegirFaseActual(fases, hoyIso);
  return fases
    .filter((fase) => TIPOS_CON_CLASIFICACION.includes(fase.tipo))
    .sort((a, b) => b.orden - a.orden)
    .map((fase) => ({ fase, estado: estadoFase(fase, actual) }));
}
