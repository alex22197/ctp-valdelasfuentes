import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import type { CalendarioDeFase } from './interfaces/calendario-de-fase.interface';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';

/**
 * Reparte las confrontaciones de toda la competición por fase, con las fases en su orden. Las
 * confrontaciones llegan ya en orden de calendario y lo conservan.
 */
export function agruparPorFase(
  filas: readonly { fase: Fase; confrontacion: ConfrontacionNuestroEquipo }[],
): CalendarioDeFase[] {
  const porFase = new Map<string, { fase: Fase; confrontaciones: ConfrontacionNuestroEquipo[] }>();
  for (const { fase, confrontacion } of filas) {
    const grupo = porFase.get(fase.id) ?? { fase, confrontaciones: [] };
    grupo.confrontaciones.push(confrontacion);
    porFase.set(fase.id, grupo);
  }
  return [...porFase.values()].sort((a, b) => a.fase.orden - b.fase.orden);
}

/**
 * El calendario con la fase actual aunque todavía no tenga partidos (los retos hasta que la
 * liga publica el cruce), para poder decir que está pendiente.
 */
export function conFaseActual(
  calendario: readonly CalendarioDeFase[],
  actual: Fase,
): CalendarioDeFase[] {
  if (calendario.some((grupo) => grupo.fase.id === actual.id)) {
    return [...calendario];
  }
  return [...calendario, { fase: actual, confrontaciones: [] }].sort(
    (a, b) => a.fase.orden - b.fase.orden,
  );
}

/** Todas las confrontaciones seguidas, de la primera fase a la última. */
export function aplanarCalendario(
  calendario: readonly CalendarioDeFase[],
): ConfrontacionNuestroEquipo[] {
  return calendario.flatMap((grupo) => grupo.confrontaciones);
}

/** La última confrontación ya jugada de toda la competición, o `null`. */
export function ultimaJugada(
  calendario: readonly CalendarioDeFase[],
): ConfrontacionNuestroEquipo | null {
  return (
    aplanarCalendario(calendario)
      .filter((confrontacion) => confrontacion.estado === 'jugada')
      .at(-1) ?? null
  );
}
