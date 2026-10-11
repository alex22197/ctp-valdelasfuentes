import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';

/** «Juega en masculino y mixto, normalmente de revés.» */
export function describirJugador(sexo: Sexo, lado: Lado | null): string {
  const partidos = sexo === 'masculino' ? 'masculino y mixto' : 'femenino y mixto';
  const enLado = lado ? `, normalmente de ${lado === 'reves' ? 'revés' : 'drive'}` : '';
  return `Juega en ${partidos}${enLado}.`;
}
