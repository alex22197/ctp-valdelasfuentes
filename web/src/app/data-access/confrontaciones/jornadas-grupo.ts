import type { EnfrentamientoGrupo } from './interfaces/enfrentamiento-grupo.interface';
import type { JornadaGrupo } from './interfaces/jornada-grupo.interface';

/**
 * Reparte los enfrentamientos del grupo por jornada, en orden y con el nuestro primero. Los
 * que no tienen número (eliminatorias) van al final, juntos.
 */
export function agruparPorJornada(enfrentamientos: readonly EnfrentamientoGrupo[]): JornadaGrupo[] {
  const porJornada = new Map<number | null, EnfrentamientoGrupo[]>();
  for (const enfrentamiento of enfrentamientos) {
    const lista = porJornada.get(enfrentamiento.jornada) ?? [];
    lista.push(enfrentamiento);
    porJornada.set(enfrentamiento.jornada, lista);
  }
  return [...porJornada.entries()]
    .sort(([a], [b]) => (a ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER))
    .map(([jornada, lista]) => ({
      titulo: jornada === null ? 'Eliminatoria' : `Jornada ${jornada}`,
      enfrentamientos: [...lista].sort((a, b) => Number(esNuestro(b)) - Number(esNuestro(a))),
    }));
}

/** Si juega nuestro equipo, de local o de visitante. */
export function esNuestro(enfrentamiento: EnfrentamientoGrupo): boolean {
  return enfrentamiento.local.esNuestro || enfrentamiento.visitante.esNuestro;
}

/**
 * La última jornada del grupo en la que ya hay algún resultado, para enseñarla en la portada.
 * `null` si todavía no se ha jugado nada. Las jornadas llegan en orden (`agruparPorJornada`).
 */
export function ultimaJornadaConResultados(jornadas: readonly JornadaGrupo[]): JornadaGrupo | null {
  return (
    jornadas.filter((jornada) => jornada.enfrentamientos.some((e) => e.marcador !== null)).at(-1) ??
    null
  );
}
