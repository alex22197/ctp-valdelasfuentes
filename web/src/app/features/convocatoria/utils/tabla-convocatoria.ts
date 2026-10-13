import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import { clavePartido } from '@shared/utils/etiquetas-partido';
import { describirFechaCorta } from '@shared/utils/fechas';
import type { FilaTablaConvocatoria } from '../interfaces/fila-tabla-convocatoria.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import type { TablaConvocatoria } from '../interfaces/tabla-convocatoria.interface';

/** Normativa: con menos de 6 pistas se juega en este orden. */
const ORDEN_CON_POCAS_PISTAS = [
  'femenino-1',
  'masculino-1',
  'mixto-1',
  'femenino-2',
  'masculino-2',
  'masculino-3',
];

const ABREVIATURA: Record<TipoPartido, string> = {
  masculino: 'MASC.',
  femenino: 'FEM.',
  mixto: '',
};

type DatosConfrontacion = Pick<
  ConfrontacionNuestroEquipo,
  'rival' | 'fechaHora' | 'fechaPrevista' | 'numeroPistas'
>;

/**
 * La convocatoria tal como la manda el capitán en una imagen: «vs SOTO TORREJÓN SÁBADO
 * 12:00 LOS 6 A LA VEZ» y una fila por pareja con revés y drive. Con menos pistas que
 * partidos, las parejas van en el orden de juego de la normativa. `nombres` da el nombre de
 * cada jugador por su id (el completo, si se tiene).
 */
export function construirTablaConvocatoria(
  confrontacion: DatosConfrontacion,
  huecos: readonly HuecoAlineacion[],
  nombres: ReadonlyMap<string, string>,
): TablaConvocatoria {
  const pistas = confrontacion.numeroPistas;
  const todasALaVez = pistas !== null && pistas >= huecos.length;
  const turnos =
    pistas !== null && !todasALaVez ? [`EN ${pistas} ${pistas === 1 ? 'PISTA' : 'PISTAS'}`] : [];
  const titulo = [
    `vs ${aMayusculas(confrontacion.rival.nombre)}`,
    aMayusculas(describirFechaCorta(confrontacion.fechaHora, confrontacion.fechaPrevista)),
    ...(todasALaVez ? [`LOS ${huecos.length} A LA VEZ`] : turnos),
  ].join(' ');

  const nombre = (id: string | null): string => (id ? (nombres.get(id) ?? '?') : '?');
  const ordenados = todasALaVez || pistas === null ? huecos : ordenarPorTurno(huecos);
  const filas = ordenados.map((hueco): FilaTablaConvocatoria => ({
    etiqueta: etiquetaPareja(hueco.tipo, hueco.numero),
    tipo: hueco.tipo,
    reves: hueco.bloqueado ? 'WO' : nombre(hueco.idReves),
    drive: hueco.bloqueado ? '' : nombre(hueco.idDrive),
  }));
  return { titulo, filas };
}

/**
 * Solo se puede copiar una convocatoria completa y guardada: cada pista con sus dos
 * jugadores (o cerrada por un WO en contra) y sin cambios pendientes.
 */
export function convocatoriaCopiable(
  huecos: readonly HuecoAlineacion[],
  hayCambios: boolean,
): boolean {
  return (
    !hayCambios &&
    huecos.length > 0 &&
    huecos.every((hueco) => hueco.bloqueado || (hueco.idReves !== null && hueco.idDrive !== null))
  );
}

/** «PAREJA 1 MASC.», «PAREJA 2 FEM.» o «PAREJA MIXTO». */
export function etiquetaPareja(tipo: TipoPartido, numero: number): string {
  return tipo === 'mixto' ? 'PAREJA MIXTO' : `PAREJA ${numero} ${ABREVIATURA[tipo]}`;
}

function aMayusculas(texto: string): string {
  return texto.toLocaleUpperCase('es');
}

function ordenarPorTurno(huecos: readonly HuecoAlineacion[]): HuecoAlineacion[] {
  const turno = (hueco: HuecoAlineacion): number => {
    const posicion = ORDEN_CON_POCAS_PISTAS.indexOf(clavePartido(hueco));
    return posicion === -1 ? ORDEN_CON_POCAS_PISTAS.length : posicion;
  };
  return [...huecos].sort((a, b) => turno(a) - turno(b));
}
