import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';

const NOMBRE_TIPO: Record<TipoPartido, string> = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  mixto: 'Mixto',
};

/** «Masculino, pareja 2» o «Mixto» (solo hay un mixto por jornada). */
export function etiquetaPartido(tipo: TipoPartido, numero: number): string {
  return tipo === 'mixto' ? NOMBRE_TIPO.mixto : `${NOMBRE_TIPO[tipo]}, pareja ${numero}`;
}

/** «Masculino 2», «Femenino 1» o «Mixto»: el nombre corto que se usa en WhatsApp. */
export function nombrePista(tipo: TipoPartido, numero: number): string {
  return tipo === 'mixto' ? NOMBRE_TIPO.mixto : `${NOMBRE_TIPO[tipo]} ${numero}`;
}

/** Código corto para etiquetas pequeñas: «M2», «F1» o «Mixto». */
export function codigoPista(tipo: TipoPartido, numero: number): string {
  return tipo === 'mixto' ? NOMBRE_TIPO.mixto : `${NOMBRE_TIPO[tipo].charAt(0)}${numero}`;
}

/** Identificador de un partido dentro de su confrontación: «masculino-2». */
export function clavePartido(partido: { tipo: TipoPartido; numero: number }): string {
  return `${partido.tipo}-${partido.numero}`;
}
