/** En qué punto está el guardado del resultado de un partido. */
export type EstadoGuardado =
  | { readonly tipo: 'inactivo' | 'guardando' | 'guardado' }
  | { readonly tipo: 'error'; readonly mensaje: string };
