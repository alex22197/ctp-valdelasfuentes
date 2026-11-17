import type { ConfrontacionLeida } from './interfaces/confrontacion-leida.interface.ts';
import type { EquipoConocido } from './interfaces/equipo-conocido.interface.ts';
import type { PaginaGrupo } from './interfaces/pagina-grupo.interface.ts';
import { limpiarNombreEquipo, normalizarNombreEquipo } from './nombres-equipo.ts';

/** Equipos que la liga nombra y nosotros no tenemos, y los que tienen otro texto en la liga. */
export interface EquiposPorAjustar {
  /** Nombres tal cual los escribe la liga, sin repetir. */
  readonly nuevos: readonly string[];
  /** Equipos conocidos cuyo `nombre_web` hay que poner o corregir al texto exacto de la liga. */
  readonly renombrados: readonly { readonly id: string; readonly nombreWeb: string }[];
}

/**
 * Antes de planificar una fase hay que tener a todos sus equipos: un grupo cambia entre
 * fases (ascensos y descensos). Los nuevos se crean con el nombre que usa la liga, que el
 * administrador podrá retocar; a los conocidos se les guarda el texto exacto de la liga para
 * reconocerlos sin dudas la próxima vez.
 */
export function resolverEquipos(
  nombres: readonly string[],
  equipos: readonly EquipoConocido[],
): EquiposPorAjustar {
  const unicos = new Map<string, string>();
  for (const nombre of nombres) {
    unicos.set(normalizarNombreEquipo(nombre), limpiarNombreEquipo(nombre));
  }

  const nuevos: string[] = [];
  const renombrados: { id: string; nombreWeb: string }[] = [];
  for (const [neutro, texto] of unicos) {
    const equipo = equipos.find(
      (e) =>
        (e.nombreWeb !== null && normalizarNombreEquipo(e.nombreWeb) === neutro) ||
        normalizarNombreEquipo(e.nombre) === neutro,
    );
    if (!equipo) {
      nuevos.push(texto);
    } else if (equipo.nombreWeb !== texto) {
      renombrados.push({ id: equipo.id, nombreWeb: texto });
    }
  }
  return { nuevos, renombrados };
}

/** Todos los equipos que salen en la página de un grupo: clasificación y jornadas. */
export function nombresDeGrupo(pagina: PaginaGrupo): string[] {
  return [
    ...pagina.clasificacion.map((fila) => fila.equipo),
    ...nombresDeCruces(pagina.jornadas.flatMap((jornada) => jornada.confrontaciones)),
  ];
}

/** Los dos equipos de cada cruce. */
export function nombresDeCruces(cruces: readonly ConfrontacionLeida[]): string[] {
  return cruces.flatMap((cruce) => [cruce.local, cruce.visitante]);
}
