import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { FormatoCompeticion } from '@data-access/competiciones/interfaces/formato-competicion.interface';
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoDeJornada } from '@data-access/estadisticas/interfaces/partido-de-jornada.interface';
import { codigoPista, nombrePista } from '@shared/utils/etiquetas-partido';
import type { CasillaJornada } from '../interfaces/casilla-jornada.interface';
import type { FilaCuadricula } from '../interfaces/fila-cuadricula.interface';

const ORDEN_TIPOS: readonly TipoPartido[] = ['masculino', 'femenino', 'mixto'];

/**
 * Cuadrícula «jornada a jornada»: una fila por jornada con una casilla por cada partido del
 * formato (M1-M3, F1-F2, mixto). Un partido que no existe o no tiene ganador (por jugar o
 * suspendido) sale como pendiente.
 */
export function construirCuadricula(
  jornadas: readonly JornadaJugada[],
  partidos: readonly PartidoDeJornada[],
  formato: FormatoCompeticion,
): FilaCuadricula[] {
  return jornadas.map((jornada) => {
    const deEsta = partidos.filter((p) => p.confrontacionId === jornada.confrontacionId);
    return {
      confrontacionId: jornada.confrontacionId,
      jornada: jornada.jornada,
      rival: jornada.rival,
      condicion: jornada.condicion,
      casillas: casillasSegunFormato(formato, deEsta),
      marcador: `${jornada.partidosGanados}-${jornada.partidosPerdidos}`,
      puntos: jornada.puntos,
    };
  });
}

function casillasSegunFormato(
  formato: FormatoCompeticion,
  partidos: readonly PartidoDeJornada[],
): CasillaJornada[] {
  return ORDEN_TIPOS.flatMap((tipo) =>
    Array.from({ length: formato[tipo] }, (_, indice) => {
      const numero = indice + 1;
      const partido = partidos.find((p) => p.tipo === tipo && p.numero === numero);
      return {
        codigo: codigoPista(tipo, numero),
        nombre: nombrePista(tipo, numero),
        estado:
          partido?.ganado === true ? 'ganado' : partido?.ganado === false ? 'perdido' : 'pendiente',
        esWo: partido?.resultado === 'wo_favor' || partido?.resultado === 'wo_contra',
      };
    }),
  );
}
