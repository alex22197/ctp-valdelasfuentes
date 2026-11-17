import type { DatosJugador } from '@data-access/jugadores/interfaces/datos-jugador.interface';
import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import type {
  FormularioJugador,
  InscritoFormulario,
} from '../interfaces/formulario-jugador.interface';

const LARGO_NOMBRE_MOSTRAR = 30;
const LARGO_NOMBRE_COMPLETO = 80;

const INSCRITO_DESDE: Record<InscritoFormulario, boolean | null> = {
  'sin-comprobar': null,
  si: true,
  no: false,
};

/** El formulario relleno con un jugador, o vacío para uno nuevo (que no es comodín). */
export function formularioDesdeJugador(jugador: JugadorGestion | null): FormularioJugador {
  if (!jugador) {
    return {
      nombreMostrar: '',
      nombreCompleto: '',
      sexo: null,
      ladoPreferido: null,
      comodin: false,
      inscrito: 'sin-comprobar',
    };
  }
  return {
    nombreMostrar: jugador.nombreMostrar,
    nombreCompleto: jugador.nombreCompleto ?? '',
    sexo: jugador.sexo,
    ladoPreferido: jugador.ladoPreferido,
    comodin: jugador.comodin,
    inscrito:
      jugador.inscritoOficial === null ? 'sin-comprobar' : jugador.inscritoOficial ? 'si' : 'no',
  };
}

/**
 * Los datos para guardar, o el primer motivo por el que no se puede. El nombre para mostrar y
 * el sexo son obligatorios: el nombre es lo que sale en la web y el sexo decide en qué partidos
 * puede jugar. La base de datos vuelve a comprobarlo todo.
 */
export function leerFormularioJugador(
  formulario: FormularioJugador,
  id: string | null,
): { readonly datos: DatosJugador } | { readonly error: string } {
  const nombreMostrar = limpiar(formulario.nombreMostrar);
  const nombreCompleto = limpiar(formulario.nombreCompleto);
  if (nombreMostrar === '') {
    return { error: 'Pon el nombre con el que sale en la web, por ejemplo «Marta P».' };
  }
  if (nombreMostrar.length > LARGO_NOMBRE_MOSTRAR) {
    return {
      error: `El nombre para mostrar es demasiado largo: ${LARGO_NOMBRE_MOSTRAR} letras como mucho.`,
    };
  }
  if (nombreCompleto.length > LARGO_NOMBRE_COMPLETO) {
    return {
      error: `El nombre completo es demasiado largo: ${LARGO_NOMBRE_COMPLETO} letras como mucho.`,
    };
  }
  if (formulario.sexo === null) {
    return { error: 'Marca si es chico o chica: decide en qué partidos puede jugar.' };
  }
  return {
    datos: {
      id,
      nombreMostrar,
      nombreCompleto: nombreCompleto || null,
      sexo: formulario.sexo,
      ladoPreferido: formulario.ladoPreferido,
      comodin: formulario.comodin,
      inscritoOficial: INSCRITO_DESDE[formulario.inscrito],
    },
  };
}

function limpiar(texto: string): string {
  return texto.replace(/\s+/g, ' ').trim();
}
