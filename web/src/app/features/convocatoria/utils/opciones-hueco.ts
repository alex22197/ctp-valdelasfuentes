import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { JugadorConvocable } from '@data-access/disponibilidad/interfaces/jugador-convocable.interface';
import { clavePartido, codigoPista } from '@shared/utils/etiquetas-partido';
import { iniciales } from '@shared/utils/iniciales';
import type { EstadoOpcion } from '../interfaces/estado-opcion.type';
import type { GrupoOpciones } from '../interfaces/grupo-opciones.interface';
import type { HuecoAlineacion } from '../interfaces/hueco-alineacion.interface';

const GRUPOS: readonly { estado: EstadoOpcion; titulo: string }[] = [
  { estado: 'jugador', titulo: 'Jugadores' },
  { estado: 'comodin', titulo: 'Comodines' },
];

/**
 * Jugadores que se pueden elegir en una pista: primero la plantilla y, al final, los
 * comodines. En masculino solo chicos y en femenino solo chicas. Quien ya está
 * en otra pista lo indica («M2»): si se elige, se mueve de allí.
 */
export function opcionesParaPista(
  tipo: TipoPartido,
  claveActual: string,
  huecos: readonly HuecoAlineacion[],
  convocables: readonly JugadorConvocable[],
): GrupoOpciones[] {
  const pistaDe = new Map<string, string>();
  for (const hueco of huecos) {
    if (clavePartido(hueco) === claveActual) {
      continue;
    }
    for (const id of [hueco.idReves, hueco.idDrive]) {
      if (id) {
        pistaDe.set(id, codigoPista(hueco.tipo, hueco.numero));
      }
    }
  }

  const candidatos = convocables
    .filter((jugador) => tipo === 'mixto' || jugador.sexo === tipo)
    .sort((a, b) => a.nombreMostrar.localeCompare(b.nombreMostrar, 'es'));

  return GRUPOS.map(({ estado, titulo }) => ({
    estado,
    titulo,
    opciones: candidatos
      .filter((jugador) => (jugador.comodin ? 'comodin' : 'jugador') === estado)
      .map((jugador) => ({
        id: jugador.id,
        nombre: jugador.nombreMostrar,
        iniciales: iniciales(jugador.nombreMostrar),
        estado,
        otraPista: pistaDe.get(jugador.id) ?? null,
      })),
  })).filter((grupo) => grupo.opciones.length > 0);
}

/** Deja en cada grupo solo a quien coincide con la búsqueda (sin tildes ni mayúsculas). */
export function filtrarOpciones(
  grupos: readonly GrupoOpciones[],
  busqueda: string,
): GrupoOpciones[] {
  const texto = normalizar(busqueda.trim());
  if (!texto) {
    return [...grupos];
  }
  return grupos
    .map((grupo) => ({
      ...grupo,
      opciones: grupo.opciones.filter((opcion) => normalizar(opcion.nombre).includes(texto)),
    }))
    .filter((grupo) => grupo.opciones.length > 0);
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}
