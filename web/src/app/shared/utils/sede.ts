import type { SedeDescrita } from './interfaces/sede-descrita.interface';

/** Solo números, comas y puntos: unas coordenadas, que no dicen nada a nadie. */
const COORDENADAS = /^[-\d.,\s]+$/;

/**
 * La sede se puede guardar como texto o como enlace de Google Maps. Del enlace se saca el
 * sitio («Padel Attraction Indoor, C. Grafito, 29, Torrejón…» → nombre y dirección) de su
 * búsqueda (`?q=`) o de su ruta (`/maps/place/…`). Los enlaces cortos (maps.app.goo.gl) no lo
 * traen: queda solo el enlace. Solo vale https, para no enlazar a cualquier cosa.
 */
export function describirSede(sede: string | null): SedeDescrita | null {
  const texto = sede?.trim();
  if (!texto) {
    return null;
  }
  const enlace = enlaceSeguro(texto);
  if (!enlace) {
    return { nombre: texto, direccion: null, enlace: null };
  }
  const sitio = sitioDelEnlace(enlace);
  if (!sitio) {
    return { nombre: null, direccion: null, enlace: enlace.href };
  }
  const [nombre, ...resto] = sitio.split(',').map((parte) => parte.trim());
  return { nombre, direccion: resto.join(', ') || null, enlace: enlace.href };
}

function enlaceSeguro(texto: string): URL | null {
  if (!/^https:\/\//i.test(texto)) {
    return null;
  }
  try {
    return new URL(texto);
  } catch {
    return null;
  }
}

function sitioDelEnlace(enlace: URL): string | null {
  const busqueda = enlace.searchParams.get('q') ?? enlace.searchParams.get('query');
  const lugar = /\/maps\/place\/([^/]+)/.exec(enlace.pathname)?.[1];
  const sitio = busqueda ?? (lugar ? decodificar(lugar) : null);
  return sitio?.trim() && !COORDENADAS.test(sitio) ? sitio.trim() : null;
}

function decodificar(parte: string): string {
  try {
    return decodeURIComponent(parte.replace(/\+/g, ' '));
  } catch {
    return parte;
  }
}
