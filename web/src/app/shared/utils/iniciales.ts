/**
 * Iniciales para el círculo de una ficha de jugador: «Marta Prieto» → «MP», «Ivan G» → «IG»
 * y, con una sola palabra, sus dos primeras letras: «Sergio» → «Se», «Álvaro» → «Ál».
 * Pueden repetirse («Marta Morales» y «Marta Muro» son «MM»), por eso la ficha muestra
 * siempre también el nombre.
 */
export function iniciales(nombre: string): string {
  const palabras = nombre.trim().split(/\s+/).filter(Boolean);
  const [primera, segunda] = palabras;
  if (!primera) {
    return '?';
  }
  if (!segunda) {
    return [...primera].slice(0, 2).join('');
  }
  return `${[...primera][0]}${[...segunda][0]}`.toUpperCase();
}
