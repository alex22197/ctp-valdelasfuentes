import type { Json, Tables } from '@core/supabase/interfaces/database.types';
import type { JugadorAlineado } from './interfaces/jugador-alineado.interface';
import type { PartidoAlineacion } from './interfaces/partido-alineacion.interface';
import type { ParejaAlineacion } from './interfaces/pareja-alineacion.interface';

export type FilaParticipacion = Pick<Tables<'participacion'>, 'lado'> & {
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

/** Jugador que ocupa un lado de la pista en un partido, o `null` si está vacío. */
export function jugadorEnLado(
  participaciones: readonly FilaParticipacion[],
  lado: FilaParticipacion['lado'],
): JugadorAlineado | null {
  const participacion = participaciones.find((p) => p.lado === lado);
  return participacion
    ? { id: participacion.jugador.id, nombreMostrar: participacion.jugador.nombre_mostrar }
    : null;
}

/** Parámetro `p_parejas` de `guardar_alineacion`. */
export function mapearParejasAParametros(parejas: readonly ParejaAlineacion[]): Json {
  return parejas.map((pareja) => ({
    tipo: pareja.tipo,
    numero: pareja.numero,
    reves: pareja.idReves,
    drive: pareja.idDrive,
  }));
}
