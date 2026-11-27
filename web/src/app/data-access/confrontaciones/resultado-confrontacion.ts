import type { BalanceConfrontaciones } from './interfaces/balance-confrontaciones.interface';
import type { ConfrontacionNuestroEquipo } from './interfaces/confrontacion-nuestro-equipo.interface';
import type { MarcadorConfrontacion } from './interfaces/marcador-confrontacion.interface';
import type { ResultadoConfrontacion } from './interfaces/resultado-confrontacion.type';

/** Victoria, empate o derrota según los partidos ganados por cada lado. */
export function resultadoDe(marcador: MarcadorConfrontacion): ResultadoConfrontacion {
  if (marcador.nuestros === marcador.rival) {
    return 'empate';
  }
  return marcador.nuestros > marcador.rival ? 'victoria' : 'derrota';
}

/** El balance de las confrontaciones que ya tienen marcador; las demás no cuentan. */
export function balanceDe(
  confrontaciones: readonly ConfrontacionNuestroEquipo[],
): BalanceConfrontaciones {
  const balance = { victorias: 0, empates: 0, derrotas: 0 };
  for (const { marcador } of confrontaciones) {
    if (marcador) {
      const resultado = resultadoDe(marcador);
      balance[
        resultado === 'victoria' ? 'victorias' : resultado === 'empate' ? 'empates' : 'derrotas'
      ] += 1;
    }
  }
  return balance;
}

/** «1 victoria, 2 derrotas»: solo lo que hay. `null` sin ningún resultado. */
export function describirBalance(balance: BalanceConfrontaciones): string | null {
  const partes = [
    contar(balance.victorias, 'victoria', 'victorias'),
    contar(balance.empates, 'empate', 'empates'),
    contar(balance.derrotas, 'derrota', 'derrotas'),
  ].filter((parte) => parte !== null);
  return partes.length > 0 ? partes.join(', ') : null;
}

function contar(numero: number, singular: string, plural: string): string | null {
  return numero === 0 ? null : `${numero} ${numero === 1 ? singular : plural}`;
}
