import type { ContextoFase } from './interfaces/contexto-fase.interface.ts';
import type { EquipoConocido } from './interfaces/equipo-conocido.interface.ts';
import type { PaginaGrupo } from './interfaces/pagina-grupo.interface.ts';
import type {
  ConfrontacionActualizada,
  ConfrontacionNueva,
  FilaClasificacionPlan,
  PlanFase,
} from './interfaces/plan-fase.interface.ts';
import { normalizarNombreEquipo } from './nombres-equipo.ts';

/**
 * Decide qué cambia en una fase a partir de la página de la liga y de lo que ya sabemos.
 * De la liga solo se toman datos de equipo (ADR 0011):
 * - La clasificación se copia entera, tal como la publica.
 * - Las confrontaciones que faltan se crean. Las de otros equipos reciben su resultado; las
 *   nuestras no: su marcador sale de lo que metemos nosotros (ADR 0008), y si la liga dice otra
 *   cosa, solo se avisa.
 * - Una confrontación que la liga enseña a 0-0 está sin jugar.
 */
export function planificarFase(pagina: PaginaGrupo, contexto: ContextoFase): PlanFase {
  const equipos = indexarEquipos(contexto.equipos);
  const buscar = (nombre: string): EquipoConocido => {
    const equipo = equipos.get(normalizarNombreEquipo(nombre));
    if (!equipo) {
      throw new Error(`El equipo «${nombre}» no está en la base de datos`);
    }
    return equipo;
  };

  const clasificacion: FilaClasificacionPlan[] = pagina.clasificacion.map((fila) => ({
    equipoId: buscar(fila.equipo).id,
    posicion: fila.posicion,
    puntos: fila.puntos,
    ganados: fila.ganados,
    empatados: fila.empatados,
    perdidos: fila.perdidos,
    partidosFavor: fila.partidosFavor,
    partidosContra: fila.partidosContra,
  }));

  const nuevas: ConfrontacionNueva[] = [];
  const actualizadas: ConfrontacionActualizada[] = [];
  const avisos: string[] = [];

  for (const jornada of pagina.jornadas) {
    for (const leida of jornada.confrontaciones) {
      const local = buscar(leida.local);
      const visitante = buscar(leida.visitante);
      const jugada = leida.partidosLocal !== 0 || leida.partidosVisitante !== 0;
      const nuestra = local.esNuestro || visitante.esNuestro;
      const donde = `J${jornada.numero} ${local.nombre}-${visitante.nombre}`;

      const conocida = contexto.confrontaciones.find(
        (c) =>
          c.jornada === jornada.numero && c.localId === local.id && c.visitanteId === visitante.id,
      );
      const alReves = contexto.confrontaciones.find(
        (c) =>
          c.jornada === jornada.numero && c.localId === visitante.id && c.visitanteId === local.id,
      );

      if (!conocida && alReves) {
        avisos.push(`${donde}: en la web está al revés (local y visitante cambiados); no se toca`);
        continue;
      }
      if (!conocida) {
        nuevas.push({
          jornada: jornada.numero,
          localId: local.id,
          visitanteId: visitante.id,
          partidosLocal: jugada && !nuestra ? leida.partidosLocal : null,
          partidosVisitante: jugada && !nuestra ? leida.partidosVisitante : null,
          estado: jugada && !nuestra ? 'jugada' : 'programada',
        });
        continue;
      }
      if (!jugada) {
        continue;
      }
      if (nuestra) {
        const aviso = compararConNuestroMarcador(
          contexto,
          conocida.id,
          local.esNuestro,
          leida,
          donde,
        );
        if (aviso) {
          avisos.push(aviso);
        }
      } else if (
        conocida.partidosLocal !== leida.partidosLocal ||
        conocida.partidosVisitante !== leida.partidosVisitante ||
        conocida.estado !== 'jugada'
      ) {
        actualizadas.push({
          id: conocida.id,
          jornada: jornada.numero,
          partidosLocal: leida.partidosLocal,
          partidosVisitante: leida.partidosVisitante,
        });
      }
    }
  }

  return { clasificacion, nuevas, actualizadas, avisos };
}

/** Los equipos por su nombre neutro, tanto el nuestro como el de la liga. */
function indexarEquipos(equipos: readonly EquipoConocido[]): Map<string, EquipoConocido> {
  const indice = new Map<string, EquipoConocido>();
  for (const equipo of equipos) {
    indice.set(normalizarNombreEquipo(equipo.nombre), equipo);
    if (equipo.nombreWeb) {
      indice.set(normalizarNombreEquipo(equipo.nombreWeb), equipo);
    }
  }
  return indice;
}

/**
 * El aviso sobre una confrontación nuestra que la liga da por jugada: si nos faltan partidos
 * por meter o si nuestro marcador calculado no es el suyo. `null` si todo cuadra.
 */
export function compararConNuestroMarcador(
  contexto: ContextoFase,
  confrontacionId: string,
  somosLocal: boolean,
  leida: { partidosLocal: number; partidosVisitante: number },
  donde: string,
): string | null {
  const marcador = contexto.marcadores.find((m) => m.confrontacionId === confrontacionId);
  const liga = `${leida.partidosLocal}-${leida.partidosVisitante}`;
  if (!marcador || marcador.partidosPendientes > 0) {
    const faltan = marcador?.partidosPendientes ?? 'todos los';
    return `${donde}: la liga ya tiene el resultado (${liga}) y en la web faltan ${faltan} partidos`;
  }
  const nuestroLocal = somosLocal ? marcador.partidosGanados : marcador.partidosPerdidos;
  const nuestroVisitante = somosLocal ? marcador.partidosPerdidos : marcador.partidosGanados;
  if (nuestroLocal !== leida.partidosLocal || nuestroVisitante !== leida.partidosVisitante) {
    return `${donde}: el marcador no coincide, la liga dice ${liga} y la web ${nuestroLocal}-${nuestroVisitante}`;
  }
  return null;
}
