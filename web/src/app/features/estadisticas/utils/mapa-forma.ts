import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { PartidoJugadorEquipo } from '@data-access/estadisticas/interfaces/partido-jugador-equipo.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { CeldaForma } from '../interfaces/celda-forma.interface';
import type { EstadoForma } from '../interfaces/estado-forma.type';
import type { JornadaForma } from '../interfaces/jornada-forma.interface';
import type { MapaForma } from '../interfaces/mapa-forma.interface';

interface FilaJugador {
  readonly jugador: JugadorPareja;
  readonly partidos: Map<string, PartidoJugadorEquipo>;
}

/**
 * Mapa de forma de los chicos o de las chicas: una fila por jugador que ha jugado en esas
 * jornadas (los que más ganan arriba) y una columna por jornada, en orden. Un jugador juega
 * como mucho un partido por jornada.
 */
export function construirMapaForma(
  jornadas: readonly JornadaJugada[],
  partidos: readonly PartidoJugadorEquipo[],
  sexos: ReadonlyMap<string, Sexo>,
  sexo: Sexo,
): MapaForma {
  const idsJornadas = new Set(jornadas.map((j) => j.confrontacionId));
  const porJugador = new Map<string, FilaJugador>();
  for (const partido of partidos) {
    if (sexos.get(partido.jugador.id) !== sexo || !idsJornadas.has(partido.confrontacionId)) {
      continue;
    }
    const fila = porJugador.get(partido.jugador.id) ?? {
      jugador: partido.jugador,
      partidos: new Map<string, PartidoJugadorEquipo>(),
    };
    fila.partidos.set(partido.confrontacionId, partido);
    porJugador.set(partido.jugador.id, fila);
  }

  const filas = [...porJugador.values()].sort(
    (a, b) =>
      ganados(b) - ganados(a) ||
      b.partidos.size - a.partidos.size ||
      a.jugador.nombreMostrar.localeCompare(b.jugador.nombreMostrar, 'es'),
  );
  const columnas: JornadaForma[] = jornadas.map((j) => ({
    confrontacionId: j.confrontacionId,
    etiqueta: j.jornada === null ? j.rival : `J${j.jornada}`,
    rival: j.rival,
  }));

  const celdas: CeldaForma[] = filas.flatMap((fila, indiceFila) =>
    columnas.map((jornada, indiceColumna) => {
      const partido = fila.partidos.get(jornada.confrontacionId);
      return {
        fila: indiceFila,
        columna: indiceColumna,
        estado: estadoDe(partido),
        detalle: describirCeldaForma(fila.jugador, jornada, partido),
      };
    }),
  );

  return { jugadores: filas.map((f) => f.jugador), jornadas: columnas, celdas };
}

function ganados(fila: FilaJugador): number {
  return [...fila.partidos.values()].filter((p) => p.ganado).length;
}

function estadoDe(partido: PartidoJugadorEquipo | undefined): EstadoForma {
  if (!partido) {
    return 'no-jugo';
  }
  if (partido.esWo) {
    return 'wo';
  }
  return partido.ganado ? 'ganado' : 'perdido';
}

/** «Pablo, J2 contra Padel Attraction B: perdió 2-6 4-6 con Iván» o «…: no jugó». */
export function describirCeldaForma(
  jugador: JugadorPareja,
  jornada: JornadaForma,
  partido: PartidoJugadorEquipo | undefined,
): string {
  const donde = `${jugador.nombreMostrar}, ${jornada.etiqueta} contra ${jornada.rival}`;
  if (!partido) {
    return `${donde}: no jugó`;
  }
  const con = partido.companero ? ` con ${partido.companero}` : '';
  if (partido.esWo) {
    return `${donde}: ganó por WO${con}`;
  }
  const marcador = partido.marcador ? ` ${partido.marcador}` : '';
  return `${donde}: ${partido.ganado ? 'ganó' : 'perdió'}${marcador}${con}`;
}
