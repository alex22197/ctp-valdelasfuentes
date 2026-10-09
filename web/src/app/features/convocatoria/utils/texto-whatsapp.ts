import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { clavePartido, nombrePista } from '@shared/utils/etiquetas-partido';
import { describirFechaCorta } from '@shared/utils/fechas';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';

/** Normativa: con menos de 6 pistas se juega en este orden. */
const ORDEN_CON_POCAS_PISTAS = [
  'femenino-1',
  'masculino-1',
  'mixto-1',
  'femenino-2',
  'masculino-2',
  'masculino-3',
];

type DatosConfrontacion = Pick<
  ConfrontacionNuestroEquipo,
  'rival' | 'fechaHora' | 'fechaPrevista' | 'numeroPistas'
>;

/**
 * La convocatoria con el formato del capitán: «vs Soto Torrejón, sábado 12:00, los 6 a la
 * vez» y una línea por pareja, revés a la izquierda y drive a la derecha. Con menos de 6
 * pistas las parejas van en el orden de juego de la normativa.
 */
export function textoConvocatoria(
  confrontacion: DatosConfrontacion,
  huecos: readonly HuecoAlineacion[],
  convocables: readonly JugadorConvocable[],
): string {
  const nombres = new Map(convocables.map((jugador) => [jugador.id, jugador.nombreMostrar]));
  const nombre = (id: string | null): string => (id ? (nombres.get(id) ?? '?') : '?');
  const pistas = confrontacion.numeroPistas;
  const todasALaVez = pistas !== null && pistas >= huecos.length;

  const cabecera = [
    `vs ${confrontacion.rival.nombre}`,
    describirFechaCorta(confrontacion.fechaHora, confrontacion.fechaPrevista),
    ...(todasALaVez ? [`los ${huecos.length} a la vez`] : []),
  ].join(', ');

  const ordenados = todasALaVez || pistas === null ? huecos : ordenarPorTurno(huecos);
  const parejas = ordenados.map((hueco) =>
    hueco.bloqueado
      ? `${nombrePista(hueco.tipo, hueco.numero)}: WO`
      : `${nombrePista(hueco.tipo, hueco.numero)}: ${nombre(hueco.idReves)} - ${nombre(hueco.idDrive)}`,
  );
  return [cabecera, '(revés - drive)', ...parejas].join('\n');
}

/** Recordatorio para quien no ha contestado a la encuesta. Vacío si han contestado todos. */
export function textoRecordatorio(
  confrontacion: DatosConfrontacion,
  sinResponder: readonly JugadorConvocable[],
): string {
  if (sinResponder.length === 0) {
    return '';
  }
  const nombres = sinResponder.map((jugador) => jugador.nombreMostrar);
  const lista =
    nombres.length === 1
      ? nombres[0]
      : `${nombres.slice(0, -1).join(', ')} y ${nombres[nombres.length - 1]}`;
  const fecha = describirFechaCorta(confrontacion.fechaHora, confrontacion.fechaPrevista);
  return `Falta por contestar a la encuesta del partido contra ${confrontacion.rival.nombre} (${fecha}): ${lista}. ¿Podéis decir si vais?`;
}

function ordenarPorTurno(huecos: readonly HuecoAlineacion[]): HuecoAlineacion[] {
  const turno = (hueco: HuecoAlineacion): number => {
    const posicion = ORDEN_CON_POCAS_PISTAS.indexOf(clavePartido(hueco));
    return posicion === -1 ? ORDEN_CON_POCAS_PISTAS.length : posicion;
  };
  return [...huecos].sort((a, b) => turno(a) - turno(b));
}
