import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import type { GrupoRespuestas } from '../interfaces/grupo-respuestas.interface';

/**
 * Las respuestas a la encuesta en los cuatro grupos de la vista de capitán. Convocados son
 * los de la alineación guardada (ADR 0009), comodines incluidos; en el resto de grupos los
 * comodines no aparecen, porque no están en la encuesta.
 */
export function agruparRespuestas(convocables: readonly JugadorConvocable[]): GrupoRespuestas[] {
  const ordenados = [...convocables].sort((a, b) =>
    a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'),
  );
  const sinConvocar = ordenados.filter((jugador) => !jugador.convocado && !jugador.comodin);
  return [
    {
      variante: 'convocados',
      titulo: 'Convocados',
      jugadores: ordenados.filter((jugador) => jugador.convocado),
    },
    {
      variante: 'pueden',
      titulo: 'Pueden ir, sin convocar',
      jugadores: sinConvocar.filter((jugador) => jugador.respuesta === 'si'),
    },
    {
      variante: 'no-pueden',
      titulo: 'No pueden',
      jugadores: sinConvocar.filter((jugador) => jugador.respuesta === 'no'),
    },
    {
      variante: 'sin-responder',
      titulo: 'Sin responder',
      jugadores: sinConvocar.filter((jugador) => jugador.respuesta === null),
    },
  ];
}
