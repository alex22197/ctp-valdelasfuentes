import type { FilaClasificacionLeida } from './interfaces/fila-clasificacion-leida.interface.ts';
import type { JornadaLeida } from './interfaces/jornada-leida.interface.ts';
import type { PaginaGrupo } from './interfaces/pagina-grupo.interface.ts';
import { limpiarNombreEquipo } from './nombres-equipo.ts';
import { filasDeTabla, leerConfrontacion, leerNumero } from './tabla-html.ts';

/**
 * Lee la página de un grupo de la web de la liga (area_grupo.php y area_grupo_clausura.php):
 * cada jornada es un «Jornada N» seguido de una tabla con el marcador local, el local, «VS», el
 * visitante y el marcador visitante; la clasificación es la tabla de clase «tabla». Si la página
 * cambia de forma, falla con un mensaje claro en vez de guardar datos a medias.
 */
export function analizarPaginaGrupo(html: string): PaginaGrupo {
  const fase = /Estás viendo la Fase de\s*([^<]+?)\s*</.exec(html)?.[1] ?? null;
  const jornadas = leerJornadas(html);
  const clasificacion = leerClasificacion(html);
  if (jornadas.length === 0) {
    throw new Error('La página no tiene ninguna jornada: ¿ha cambiado la web de la liga?');
  }
  return { fase, jornadas, clasificacion };
}

const JORNADA =
  /<h5 class=["']subtitulo["']>\s*Jornada\s+(\d+)\s*<\/h5>\s*<table class=["']tablaDatos["']>([\s\S]*?)<\/table>/gi;
const CLASIFICACION = /<table class=["']tabla["'][^>]*>([\s\S]*?)<\/table>/i;
const COLUMNAS_CLASIFICACION = [
  '#',
  'Equipo',
  'Puntos',
  'C. Ganadas',
  'C. Empatadas',
  'C. Perdidas',
  'P. Favor',
  'P. Contra',
];

function leerJornadas(html: string): JornadaLeida[] {
  return [...html.matchAll(JORNADA)].map((coincidencia) => {
    const numero = Number(coincidencia[1]);
    const confrontaciones = filasDeTabla(coincidencia[2] ?? '').map((celdas, indice) =>
      leerConfrontacion(celdas, `Jornada ${numero}, fila ${indice + 1}`),
    );
    return { numero, confrontaciones };
  });
}

function leerClasificacion(html: string): FilaClasificacionLeida[] {
  const tabla = CLASIFICACION.exec(html)?.[1];
  if (tabla === undefined) {
    throw new Error('La página no tiene la tabla de clasificación: ¿ha cambiado la web?');
  }
  const [cabecera, ...filas] = filasDeTabla(tabla);
  if (!cabecera || cabecera.join('|') !== COLUMNAS_CLASIFICACION.join('|')) {
    throw new Error(`La clasificación tiene otras columnas: ${cabecera?.join(', ') ?? 'ninguna'}`);
  }
  return filas.map((celdas, indice) => {
    const donde = `Clasificación, fila ${indice + 1}`;
    const [posicion, equipo, ...numeros] = celdas;
    if (celdas.length !== 8 || !equipo) {
      throw new Error(`${donde}: se esperaban 8 columnas`);
    }
    const [puntos, ganados, empatados, perdidos, partidosFavor, partidosContra] = numeros.map(
      (texto, i) => leerNumero(texto, `${donde}, ${COLUMNAS_CLASIFICACION[i + 2]}`),
    );
    return {
      posicion: leerNumero(posicion, `${donde}, posición`),
      equipo: limpiarNombreEquipo(equipo),
      puntos: puntos ?? 0,
      ganados: ganados ?? 0,
      empatados: empatados ?? 0,
      perdidos: perdidos ?? 0,
      partidosFavor: partidosFavor ?? 0,
      partidosContra: partidosContra ?? 0,
    };
  });
}
