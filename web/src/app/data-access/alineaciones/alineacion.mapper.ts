import type { Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorAlineado } from './interfaces/jugador-alineado.interface';
import type { PartidoAlineacion } from './interfaces/partido-alineacion.interface';

type FilaParticipacion = Pick<Tables<'participacion'>, 'lado'> & {
  jugador: Pick<Tables<'jugador'>, 'id' | 'nombre_mostrar'>;
};

export type FilaPartidoAlineacion = Pick<Tables<'partido'>, 'id' | 'tipo' | 'numero'> & {
  participacion: FilaParticipacion[];
};

export function mapearPartidoAlineacion(fila: FilaPartidoAlineacion): PartidoAlineacion {
  return {
    id: fila.id,
    tipo: fila.tipo,
    numero: fila.numero,
    reves: jugadorEnLado(fila.participacion, 'reves'),
    drive: jugadorEnLado(fila.participacion, 'drive'),
  };
}

function jugadorEnLado(
  participaciones: readonly FilaParticipacion[],
  lado: FilaParticipacion['lado'],
): JugadorAlineado | null {
  const participacion = participaciones.find((p) => p.lado === lado);
  return participacion
    ? { id: participacion.jugador.id, nombreMostrar: participacion.jugador.nombre_mostrar }
    : null;
}
