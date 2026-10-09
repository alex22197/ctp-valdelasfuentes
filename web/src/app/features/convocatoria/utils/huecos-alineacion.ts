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

/** Aplica el cambio de un desplegable sin tocar el resto de pistas. */
export function aplicarCambio(
  huecos: readonly HuecoAlineacion[],
  cambio: CambioHueco,
): HuecoAlineacion[] {
  return huecos.map((hueco) => {
    if (clavePartido(hueco) !== cambio.clave) {
      return hueco;
    }
    return cambio.lado === 'reves'
      ? { ...hueco, idReves: cambio.idJugador }
      : { ...hueco, idDrive: cambio.idJugador };
  });
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
