/**
 * Error de lectura o escritura en la base de datos, con un mensaje en castellano apto
 * para mostrar al usuario. El error original se conserva en `cause` para depurar.
 */
export class ErrorAccesoDatos extends Error {
  constructor(mensaje: string, causa?: unknown) {
    super(mensaje, { cause: causa });
    this.name = 'ErrorAccesoDatos';
  }
}

/** Lanza un `ErrorAccesoDatos` si la respuesta de Supabase trae error. */
export function lanzarSiHayError(error: unknown, mensaje: string): void {
  if (error) {
    throw new ErrorAccesoDatos(mensaje, error);
  }
}

/** Código de PostgreSQL de las excepciones que levantan nuestras funciones con `raise exception`. */
const EXCEPCION_PROPIA = 'P0001';

/**
 * Como `lanzarSiHayError`, pero los mensajes que levanta la propia función de la base de datos
 * (en castellano, como «La jornada ya está terminada») llegan tal cual al usuario.
 */
export function lanzarConMensajePropio(
  error: { code?: string; message: string } | null,
  porDefecto: string,
): asserts error is null {
  if (error) {
    throw new ErrorAccesoDatos(error.code === EXCEPCION_PROPIA ? error.message : porDefecto, error);
  }
}
