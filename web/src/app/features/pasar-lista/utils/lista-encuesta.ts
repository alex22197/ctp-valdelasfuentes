import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import type { GrupoEncuesta } from '../interfaces/grupo-encuesta.interface';
import type { OpcionRespuesta } from '../interfaces/opcion-respuesta.interface';
import type { RecuentoEncuesta } from '../interfaces/recuento-encuesta.interface';

export const OPCIONES_RESPUESTA: readonly OpcionRespuesta[] = [
  { valor: 'si', etiqueta: 'Sí', descripcion: 'Puede ir' },
  { valor: 'no', etiqueta: 'No', descripcion: 'No puede ir' },
  { valor: null, etiqueta: '?', descripcion: 'Sin responder' },
];

const TITULOS: Record<Sexo, string> = { masculino: 'Chicos', femenino: 'Chicas' };

/** Chicos y chicas, en ese orden, cada grupo ordenado por nombre. Omite los vacíos. */
export function agruparPorSexo(jugadores: readonly JugadorEncuesta[]): GrupoEncuesta[] {
  return (['masculino', 'femenino'] as const)
    .map((sexo) => {
      const delGrupo = jugadores
        .filter((jugador) => jugador.sexo === sexo)
        .sort((a, b) => a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'));
      return {
        sexo,
        titulo: TITULOS[sexo],
        jugadores: delGrupo,
        recuento: contarRespuestas(delGrupo),
      };
    })
    .filter((grupo) => grupo.jugadores.length > 0);
}

export function contarRespuestas(jugadores: readonly JugadorEncuesta[]): RecuentoEncuesta {
  const pueden = jugadores.filter((jugador) => jugador.respuesta === 'si').length;
  const noPueden = jugadores.filter((jugador) => jugador.respuesta === 'no').length;
  return {
    pueden,
    noPueden,
    sinResponder: jugadores.length - pueden - noPueden,
    total: jugadores.length,
  };
}
