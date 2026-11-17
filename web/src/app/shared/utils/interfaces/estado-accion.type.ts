/**
 * En qué punto está una acción que tarda (guardar, publicar, entrar…): una unión
 * discriminada, así no hay forma de estar «guardando» y «con error» a la vez. El error lleva
 * su mensaje en castellano, listo para enseñar.
 */
export type EstadoAccion =
  | { readonly tipo: 'inactivo' | 'en-curso' | 'hecho' }
  | { readonly tipo: 'error'; readonly mensaje: string };
