import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { FormatoCompeticion } from '@data-access/competiciones/interfaces/formato-competicion.interface';
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { PartidoDeJornada } from '@data-access/estadisticas/interfaces/partido-de-jornada.interface';
import { etiquetaPartido } from '@shared/utils/etiquetas-partido';
import type { CasillaJornada } from '../interfaces/casilla-jornada.interface';
import type { FilaCuadricula } from '../interfaces/fila-cuadricula.interface';
import type { GrupoCuadricula } from '../interfaces/grupo-cuadricula.interface';
import { notaResultado, textoPareja, textoSet } from './textos-partido';

const GRUPOS: readonly { tipo: TipoPartido; nombre: string }[] = [
  { tipo: 'masculino', nombre: 'Masculino' },
  { tipo: 'femenino', nombre: 'Femenino' },
  { tipo: 'mixto', nombre: 'Mixto' },
];

/**
 * «Jornada a jornada»: una fila por jornada con sus partidos agrupados por categoría
 * (masculinos, femeninos y mixto, según el formato). Un partido que no existe o no tiene
 * ganador (por jugar o suspendido) sale como pendiente.
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
      grupos: gruposSegunFormato(formato, deEsta),
      marcador: `${jornada.partidosGanados}-${jornada.partidosPerdidos}`,
      puntos: jornada.puntos,
    };
  });
}

function gruposSegunFormato(
  formato: FormatoCompeticion,
  partidos: readonly PartidoDeJornada[],
): GrupoCuadricula[] {
  return GRUPOS.filter(({ tipo }) => formato[tipo] > 0).map(({ tipo, nombre }) => ({
    tipo,
    nombre,
    casillas: Array.from({ length: formato[tipo] }, (_, indice) =>
      casilla(
        tipo,
        indice + 1,
        partidos.find((p) => p.tipo === tipo && p.numero === indice + 1),
      ),
    ),
  }));
}

function casilla(
  tipo: TipoPartido,
  numero: number,
  partido: PartidoDeJornada | undefined,
): CasillaJornada {
  return {
    nombre: etiquetaPartido(tipo, numero),
    etiqueta: tipo === 'mixto' ? null : `Pareja ${numero}`,
    estado:
      partido?.ganado === true ? 'ganado' : partido?.ganado === false ? 'perdido' : 'pendiente',
    pareja: partido ? textoPareja(partido.reves, partido.drive) : null,
    sets: partido ? partido.sets.map(textoSet) : [],
    nota: notaResultado(partido?.resultado ?? null),
  };
}
