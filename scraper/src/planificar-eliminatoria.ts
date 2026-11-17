import type { ConfrontacionLeida } from './interfaces/confrontacion-leida.interface.ts';
import type { ContextoFase } from './interfaces/contexto-fase.interface.ts';
import type { EquipoConocido } from './interfaces/equipo-conocido.interface.ts';
import type { PlanFase } from './interfaces/plan-fase.interface.ts';
import { normalizarNombreEquipo } from './nombres-equipo.ts';
import { compararConNuestroMarcador } from './planificar-fase.ts';

/** Los cruces de una eliminatoria en los que jugamos nosotros; el resto es de otras divisiones. */
export function crucesNuestros(
  cruces: readonly ConfrontacionLeida[],
  equipos: readonly EquipoConocido[],
): ConfrontacionLeida[] {
  const nuestros = new Set(
    equipos
      .filter((e) => e.esNuestro)
      .flatMap((e) => [e.nombre, e.nombreWeb ?? e.nombre])
      .map(normalizarNombreEquipo),
  );
  return cruces.filter(
    (c) =>
      nuestros.has(normalizarNombreEquipo(c.local)) ||
      nuestros.has(normalizarNombreEquipo(c.visitante)),
  );
}

/**
 * Qué cambia en una eliminatoria (retos, play-off…): solo nuestros cruces. Se crean si faltan,
 * sin jornada; el marcador no se escribe nunca (ADR 0008), solo se avisa si la liga dice otra
 * cosa que nosotros. No hay clasificación.
 */
export function planificarEliminatoria(
  cruces: readonly ConfrontacionLeida[],
  contexto: ContextoFase,
): PlanFase {
  const porNombre = new Map<string, EquipoConocido>();
  for (const equipo of contexto.equipos) {
    porNombre.set(normalizarNombreEquipo(equipo.nombre), equipo);
    if (equipo.nombreWeb) {
      porNombre.set(normalizarNombreEquipo(equipo.nombreWeb), equipo);
    }
  }
  const buscar = (nombre: string): EquipoConocido => {
    const equipo = porNombre.get(normalizarNombreEquipo(nombre));
    if (!equipo) {
      throw new Error(`El equipo «${nombre}» no está en la base de datos`);
    }
    return equipo;
  };

  const plan = { clasificacion: [], nuevas: [], actualizadas: [], avisos: [] } satisfies PlanFase;
  const nuevas: PlanFase['nuevas'][number][] = [];
  const avisos: string[] = [];

  for (const cruce of crucesNuestros(cruces, contexto.equipos)) {
    const local = buscar(cruce.local);
    const visitante = buscar(cruce.visitante);
    const donde = `${contexto.faseNombre} ${local.nombre}-${visitante.nombre}`;
    const conocida = contexto.confrontaciones.find(
      (c) => c.jornada === null && c.localId === local.id && c.visitanteId === visitante.id,
    );
    const alReves = contexto.confrontaciones.find(
      (c) => c.jornada === null && c.localId === visitante.id && c.visitanteId === local.id,
    );
    if (!conocida && alReves) {
      avisos.push(`${donde}: en la web está al revés (local y visitante cambiados); no se toca`);
    } else if (!conocida) {
      nuevas.push({
        jornada: null,
        localId: local.id,
        visitanteId: visitante.id,
        partidosLocal: null,
        partidosVisitante: null,
        estado: 'programada',
      });
    } else if (cruce.partidosLocal !== 0 || cruce.partidosVisitante !== 0) {
      const aviso = compararConNuestroMarcador(
        contexto,
        conocida.id,
        local.esNuestro,
        cruce,
        donde,
      );
      if (aviso) {
        avisos.push(aviso);
      }
    }
  }
  return { ...plan, nuevas, avisos };
}
