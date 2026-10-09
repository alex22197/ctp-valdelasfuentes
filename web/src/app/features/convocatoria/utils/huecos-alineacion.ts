import type { ParejaAlineacion } from '@data-access/alineaciones/interfaces/pareja-alineacion.interface';
import type { PartidoConResultado } from '@data-access/resultados/interfaces/partido-con-resultado.interface';
import type { CambioHueco } from '../interfaces/cambio-hueco.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import { clavePartido } from '@shared/utils/etiquetas-partido';

/** Las pistas de la alineación guardada. Un WO en contra bloquea su pista. */
export function huecosDesdePartidos(partidos: readonly PartidoConResultado[]): HuecoAlineacion[] {
  return partidos.map((partido) => ({
    tipo: partido.tipo,
    numero: partido.numero,
    idReves: partido.reves?.id ?? null,
    idDrive: partido.drive?.id ?? null,
    bloqueado: partido.marcador.resultado === 'wo_contra',
  }));
}

/**
 * Coloca a un jugador en un lado de una pista. Si ya estaba en otro sitio, se mueve: su
 * hueco anterior queda libre (no se intercambia con nadie). Las pistas que no cambian
 * conservan el mismo objeto.
 */
export function aplicarCambio(
  huecos: readonly HuecoAlineacion[],
  cambio: CambioHueco,
): HuecoAlineacion[] {
  const { idJugador } = cambio;
  return huecos.map((hueco) => {
    const esDestino = clavePartido(hueco) === cambio.clave;
    const reves =
      esDestino && cambio.lado === 'reves' ? idJugador : liberarSiEs(hueco.idReves, idJugador);
    const drive =
      esDestino && cambio.lado === 'drive' ? idJugador : liberarSiEs(hueco.idDrive, idJugador);
    return reves === hueco.idReves && drive === hueco.idDrive
      ? hueco
      : { ...hueco, idReves: reves, idDrive: drive };
  });
}

function liberarSiEs(actual: string | null, idMovido: string | null): string | null {
  return idMovido !== null && actual === idMovido ? null : actual;
}

/** Lo que se envía a guardar: las pistas bloqueadas por WO en contra van vacías. */
export function parejasParaGuardar(huecos: readonly HuecoAlineacion[]): ParejaAlineacion[] {
  return huecos.map(({ tipo, numero, idReves, idDrive, bloqueado }) =>
    bloqueado ? { tipo, numero, idReves: null, idDrive: null } : { tipo, numero, idReves, idDrive },
  );
}

/** `true` si las dos alineaciones tienen a los mismos jugadores en los mismos sitios. */
export function mismasParejas(
  a: readonly HuecoAlineacion[],
  b: readonly HuecoAlineacion[],
): boolean {
  return JSON.stringify(parejasParaGuardar(a)) === JSON.stringify(parejasParaGuardar(b));
}
