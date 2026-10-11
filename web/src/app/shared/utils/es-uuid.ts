const PATRON_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Si un texto tiene forma de identificador de la base de datos. Sirve para responder
 * «no encontrado» a una dirección mal escrita sin preguntar a la base de datos, que
 * devolvería un error.
 */
export function esUuid(texto: string): boolean {
  return PATRON_UUID.test(texto);
}
