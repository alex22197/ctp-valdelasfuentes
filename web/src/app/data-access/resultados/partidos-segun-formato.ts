import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { FormatoCompeticion } from '@data-access/competiciones/interfaces/formato-competicion.interface';
import type { PartidoConResultado } from './interfaces/partido-con-resultado.interface';

/** Orden de la normativa: masculinos, femeninos y mixto. */
const ORDEN_TIPOS: readonly TipoPartido[] = ['masculino', 'femenino', 'mixto'];

/**
 * Todos los partidos que tiene una confrontación según el formato de la competición, en el
 * orden de la normativa. Los que aún no existen en la base de datos (por ejemplo, porque no
 * hay alineación) aparecen sin pareja y por jugar, para poder meter su resultado igualmente.
 */
export function completarPartidosSegunFormato(
  formato: FormatoCompeticion,
  partidos: readonly PartidoConResultado[],
): PartidoConResultado[] {
  return ORDEN_TIPOS.flatMap((tipo) =>
    Array.from({ length: formato[tipo] }, (_, indice) => {
      const numero = indice + 1;
      return (
        partidos.find((partido) => partido.tipo === tipo && partido.numero === numero) ??
        partidoVacio(tipo, numero)
      );
    }),
  );
}

function partidoVacio(tipo: TipoPartido, numero: number): PartidoConResultado {
  return {
    tipo,
    numero,
    reves: null,
    drive: null,
    marcador: { resultado: null, ganado: null, sets: [] },
  };
}
