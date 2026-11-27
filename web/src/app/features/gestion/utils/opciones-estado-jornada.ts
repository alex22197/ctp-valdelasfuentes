import type { EstadoPorJugar } from '@data-access/confrontaciones/interfaces/estado-por-jugar.type';
import type { OpcionEstadoJornada } from '../interfaces/opcion-estado-jornada.interface';

const APLAZAR: OpcionEstadoJornada = {
  destino: 'aplazada',
  texto: 'Aplazar',
  confirmacion: { pregunta: '¿Aplazar la jornada?', boton: 'Sí, aplazar' },
};

const SUSPENDER: OpcionEstadoJornada = {
  destino: 'suspendida',
  texto: 'Suspender',
  confirmacion: { pregunta: '¿Suspender la jornada?', boton: 'Sí, suspender' },
};

/**
 * Lo que se puede hacer con una jornada por jugar según cómo esté: una programada se aplaza o
 * se suspende; una aplazada o suspendida pasa a la otra o vuelve a programada, por si fue un
 * error o la liga lo corrige.
 */
export function opcionesEstadoJornada(estado: EstadoPorJugar): readonly OpcionEstadoJornada[] {
  switch (estado) {
    case 'programada':
      return [APLAZAR, SUSPENDER];
    case 'aplazada':
      return [
        { destino: 'programada', texto: 'Quitar el aplazamiento', confirmacion: null },
        { ...SUSPENDER, texto: 'Marcar como suspendida' },
      ];
    case 'suspendida':
      return [
        { destino: 'programada', texto: 'Quitar la suspensión', confirmacion: null },
        { ...APLAZAR, texto: 'Marcar como aplazada' },
      ];
  }
}
