/**
 * La liga escribe los nombres a su manera: «PADELGON “C”», «SOTO TORREJON», «Pa'delante » con
 * espacio al final. Para reconocer a un equipo se compara una forma neutra: sin acentos, en
 * mayúsculas, con las comillas unificadas y los espacios normalizados.
 */
export function normalizarNombreEquipo(nombre: string): string {
  return limpiarNombreEquipo(nombre)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[“”„«»¨´`]/g, '"')
    .replace(/[‘’]/g, "'")
    .toUpperCase();
}

/** El nombre tal cual lo escribe la liga, solo sin espacios de más. */
export function limpiarNombreEquipo(nombre: string): string {
  return nombre.replace(/\s+/g, ' ').trim();
}
