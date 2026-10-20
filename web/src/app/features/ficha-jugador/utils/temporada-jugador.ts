import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoDeJugador } from '@data-access/estadisticas/interfaces/partido-de-jugador.interface';
import { nombrePareja } from '@shared/utils/etiquetas-partido';
import type { FaseTemporada } from '../interfaces/fase-temporada.interface';
import type { FilaTemporada } from '../interfaces/fila-temporada.interface';

const NOMBRE_LADO: Record<Lado, string> = { reves: 'revés', drive: 'drive' };

/**
 * La temporada de un jugador: cada jornada jugada por el equipo, con su partido o vacía si
 * no jugó. Un jugador juega como mucho un partido por jornada (lo impide la base de datos).
 *
 * Las jornadas llegan ya ordenadas. Un partido suspendido, o uno que acabó en WO en contra,
 * no está en sus partidos, así que esa jornada sale como «no jugó».
 */
export function construirTemporada(
  jornadas: readonly JornadaJugada[],
  partidos: readonly PartidoDeJugador[],
): FaseTemporada[] {
  const partidoPorJornada = new Map(partidos.map((p) => [p.confrontacionId, p]));
  const fases: { nombre: string; orden: number; filas: FilaTemporada[] }[] = [];

  for (const jornada of jornadas) {
    let fase = fases.find((f) => f.orden === jornada.faseOrden);
    if (!fase) {
      fase = { nombre: jornada.faseNombre, orden: jornada.faseOrden, filas: [] };
      fases.push(fase);
    }
    fase.filas.push(filaTemporada(jornada, partidoPorJornada.get(jornada.confrontacionId)));
  }

  return fases.map(({ nombre, filas }) => ({ nombre, filas }));
}

function filaTemporada(jornada: JornadaJugada, partido?: PartidoDeJugador): FilaTemporada {
  const comun = {
    confrontacionId: jornada.confrontacionId,
    jornada: jornada.jornada,
    rival: jornada.rival,
    condicion: jornada.condicion,
  };
  if (!partido) {
    return {
      ...comun,
      resultado: 'no-jugo',
      detalle: null,
      marcador: null,
      diferenciaJuegos: null,
      esWo: false,
    };
  }
  return {
    ...comun,
    resultado: partido.ganado ? 'ganado' : 'perdido',
    detalle: describirPartido(partido),
    marcador: partido.esWo ? 'WO a favor' : partido.marcador,
    diferenciaJuegos: partido.esWo ? null : partido.juegosGanados - partido.juegosPerdidos,
    esWo: partido.esWo,
  };
}

/** «Pareja 1 masculina con Sergio, de revés» o «Pareja mixta, de drive» sin compañero. */
export function describirPartido(partido: PartidoDeJugador): string {
  const pista = nombrePareja(partido.tipo, partido.numero);
  const companero = partido.companero ? ` con ${partido.companero.nombreMostrar}` : '';
  return `${pista}${companero}, de ${NOMBRE_LADO[partido.lado]}`;
}
