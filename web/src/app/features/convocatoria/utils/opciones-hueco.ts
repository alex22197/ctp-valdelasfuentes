import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { clavePartido, nombrePista } from '@shared/utils/etiquetas-partido';
import type { GrupoOpciones } from '../interfaces/grupo-opciones.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';

/**
 * Jugadores que se pueden elegir en una pista, agrupados por lo que respondieron:
 * primero los que pueden, después los que no han contestado, los que no pueden y, al
 * final, los comodines. En masculino solo chicos y en femenino solo chicas. Quien ya está
 * en otra pista lo indica, para que se vea antes de moverlo.
 */
export function opcionesParaPista(
  tipo: TipoPartido,
  claveActual: string,
  huecos: readonly HuecoAlineacion[],
  convocables: readonly JugadorConvocable[],
): GrupoOpciones[] {
  const pistaDe = new Map<string, string>();
  for (const hueco of huecos) {
    if (clavePartido(hueco) === claveActual) {
      continue;
    }
    for (const id of [hueco.idReves, hueco.idDrive]) {
      if (id) {
        pistaDe.set(id, nombrePista(hueco.tipo, hueco.numero));
      }
    }
  }

  const candidatos = convocables
    .filter((jugador) => tipo === 'mixto' || jugador.sexo === tipo)
    .sort((a, b) => a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'));
  const grupo = (titulo: string, filtro: (j: JugadorConvocable) => boolean): GrupoOpciones => ({
    titulo,
    opciones: candidatos.filter(filtro).map((jugador) => {
      const otraPista = pistaDe.get(jugador.id);
      return {
        id: jugador.id,
        etiqueta: otraPista ? `${jugador.nombreMostrar} (en ${otraPista})` : jugador.nombreMostrar,
      };
    }),
  });

  return [
    grupo('Pueden', (j) => !j.comodin && j.respuesta === 'si'),
    grupo('Sin responder', (j) => !j.comodin && j.respuesta === null),
    grupo('No pueden', (j) => !j.comodin && j.respuesta === 'no'),
    grupo('Comodines', (j) => j.comodin),
  ].filter((g) => g.opciones.length > 0);
}
