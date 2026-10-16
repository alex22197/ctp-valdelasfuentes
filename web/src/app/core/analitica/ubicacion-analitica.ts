/**
 * La dirección que se manda a Google Analytics: solo el origen y la página. Se quita lo que va
 * detrás (`?…` y `#…`) porque al volver de entrar con Google la dirección lleva el código de
 * acceso, y nada de eso hace falta para contar visitas.
 */
export function ubicacionSinDatos(direccion: string): string {
  const url = new URL(direccion);
  return `${url.origin}${url.pathname}`;
}

/**
 * Los dominios en los que puede haber puesto Google Analytics sus cookies: el del sitio y cada
 * uno de los de encima (sin el último, que es solo «.dev» o «.com»). Hacen falta todos para
 * borrarlas.
 */
export function dominiosDeCookies(servidor: string): string[] {
  const partes = servidor.split('.');
  return partes.slice(0, -1).map((_, inicio) => partes.slice(inicio).join('.'));
}
