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
