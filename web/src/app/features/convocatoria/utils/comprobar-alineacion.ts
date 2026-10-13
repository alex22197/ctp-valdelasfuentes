import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { clavePartido, nombrePista } from '@shared/utils/etiquetas-partido';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';
import type { ProblemaAlineacion } from '../interfaces/problema-alineacion.interface';

/**
 * Revisa la alineación antes de guardarla. Los errores repiten las reglas que aplica la
 * base de datos (nadie juega dos partidos, sexo según el tipo de partido, mixto de chico y
 * chica) para señalarlos en su pista; los avisos no impiden guardar ni publicar.
 */
export function comprobarAlineacion(
  huecos: readonly HuecoAlineacion[],
  convocables: readonly JugadorConvocable[],
): ProblemaAlineacion[] {
  const porId = new Map(convocables.map((jugador) => [jugador.id, jugador]));
  const problemas: ProblemaAlineacion[] = [];
  const pistaDe = new Map<string, string>();

  for (const hueco of huecos) {
    const clave = clavePartido(hueco);
    const jugadores = [hueco.idReves, hueco.idDrive]
      .filter((id) => id !== null)
      .map((id) => porId.get(id))
      .filter((jugador) => jugador !== undefined);

    for (const jugador of jugadores) {
      const otraPista = pistaDe.get(jugador.id);
      if (otraPista) {
        problemas.push(error(clave, `${jugador.nombreMostrar} ya juega en ${otraPista}`));
      }
      pistaDe.set(jugador.id, nombrePista(hueco.tipo, hueco.numero));

      if (hueco.tipo !== 'mixto' && jugador.sexo !== hueco.tipo) {
        problemas.push(
          error(clave, `${jugador.nombreMostrar} no puede jugar un partido ${hueco.tipo}`),
        );
      }
    }

    const [primero, segundo] = jugadores;
    if (hueco.tipo === 'mixto' && primero && segundo && primero.sexo === segundo.sexo) {
      problemas.push(error(clave, 'El mixto lo juegan un chico y una chica'));
    }
  }

  const colocados = [...pistaDe.keys()].map((id) => porId.get(id)).filter((j) => j !== undefined);
  for (const jugador of colocados) {
    if (jugador.comodin && jugador.inscritoOficial !== true) {
      problemas.push(
        aviso(
          `${jugador.nombreMostrar} es comodín y no consta como inscrito oficialmente: si el rival lo reclama, se pierde el partido`,
        ),
      );
    }
  }

  const huecosVacios = huecos
    .filter((hueco) => !hueco.bloqueado)
    .reduce((total, hueco) => total + (hueco.idReves ? 0 : 1) + (hueco.idDrive ? 0 : 1), 0);
  if (huecosVacios > 0) {
    problemas.push(
      aviso(huecosVacios === 1 ? 'Falta 1 jugador' : `Faltan ${huecosVacios} jugadores`),
    );
  }
  return problemas;
}

function error(clave: string, mensaje: string): ProblemaAlineacion {
  return { gravedad: 'error', clave, mensaje };
}

function aviso(mensaje: string): ProblemaAlineacion {
  return { gravedad: 'aviso', clave: null, mensaje };
}
