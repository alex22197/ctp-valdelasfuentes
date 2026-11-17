import type { ConfrontacionLeida } from './interfaces/confrontacion-leida.interface.ts';
import { filasDeTabla, leerConfrontacion } from './tabla-html.ts';

const TABLA_DATOS = /<table class=["']tablaDatos["']>([\s\S]*?)<\/table>/gi;

/**
 * Lee la página de una eliminatoria (area_fase_ver.php: retos, play-off…): una sola tabla con
 * todos los cruces de la zona, de todas las divisiones, sin jornadas ni clasificación. Cada
 * fila es «marcador, local, VS, visitante, marcador»; sin jugar, 0-0.
 */
export function analizarPaginaEliminatoria(html: string): ConfrontacionLeida[] {
  const cruces = [...html.matchAll(TABLA_DATOS)].flatMap((tabla, t) =>
    filasDeTabla(tabla[1] ?? '').map((celdas, i) =>
      leerConfrontacion(celdas, `Tabla ${t + 1}, fila ${i + 1}`),
    ),
  );
  if (cruces.length === 0) {
    throw new Error('La página no tiene ningún cruce: ¿ha cambiado la web de la liga?');
  }
  return cruces;
}
