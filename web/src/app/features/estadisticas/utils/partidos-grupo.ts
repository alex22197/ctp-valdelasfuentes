import type { PartidosEquipoGrupo } from '@data-access/clasificacion/interfaces/partidos-equipo-grupo.interface';
import type { EquipoGrupo } from '../interfaces/equipo-grupo.interface';

/**
 * Suma los partidos a favor y en contra de cada equipo en las fases elegidas y los ordena de
 * mejor a peor diferencia. Un equipo del que la liga no ha publicado nada no sale.
 */
export function sumarPartidosDelGrupo(filas: readonly PartidosEquipoGrupo[]): EquipoGrupo[] {
  const porEquipo = new Map<string, EquipoGrupo>();
  for (const fila of filas) {
    if (fila.partidosFavor === null && fila.partidosContra === null) {
      continue;
    }
    const anterior = porEquipo.get(fila.equipo.id) ?? {
      equipo: fila.equipo,
      favor: 0,
      contra: 0,
      diferencia: 0,
    };
    const favor = anterior.favor + (fila.partidosFavor ?? 0);
    const contra = anterior.contra + (fila.partidosContra ?? 0);
    porEquipo.set(fila.equipo.id, { ...anterior, favor, contra, diferencia: favor - contra });
  }
  return [...porEquipo.values()].sort(
    (a, b) =>
      b.diferencia - a.diferencia ||
      b.favor - a.favor ||
      a.equipo.nombre.localeCompare(b.equipo.nombre, 'es'),
  );
}

/** «Padel Attraction B: 8 partidos a favor y 4 en contra (+4)». */
export function describirEquipoGrupo(equipo: EquipoGrupo | undefined): string {
  if (!equipo) {
    return '';
  }
  const signo = equipo.diferencia > 0 ? '+' : '';
  return `${equipo.equipo.nombre}: ${equipo.favor} partidos a favor y ${equipo.contra} en contra (${signo}${equipo.diferencia})`;
}
