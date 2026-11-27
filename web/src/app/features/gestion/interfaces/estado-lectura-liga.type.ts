/**
 * Cómo va la lectura semanal de la web de la liga, para avisar a los gestores. «Sin leer» va
 * aparte de «error» porque hay fallos que no dejan registro: si falla la copia de seguridad el
 * scraper ni se lanza, y si se rompe antes de empezar no llega a apuntar nada.
 */
export type EstadoLecturaLiga =
  | { readonly tipo: 'nunca' }
  | { readonly tipo: 'sin-leer'; readonly ultima: string; readonly dias: number }
  | { readonly tipo: 'error'; readonly fecha: string; readonly errores: readonly string[] }
  | { readonly tipo: 'avisos'; readonly fecha: string; readonly avisos: readonly string[] }
  | { readonly tipo: 'al-dia'; readonly fecha: string };
