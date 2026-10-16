import type { ConsentimientoGuardado } from './interfaces/consentimiento-guardado.interface';
import type { EstadoConsentimiento } from './interfaces/estado-consentimiento.type';

/** Una elección vale un año; después se vuelve a preguntar. */
const VALIDEZ_MS = 365 * 24 * 60 * 60 * 1000;

/**
 * Lee la elección guardada en el navegador. Lo que no se entienda o tenga más de un año cuenta
 * como «pendiente»: se vuelve a preguntar.
 */
export function leerConsentimiento(texto: string | null, ahora: Date): EstadoConsentimiento {
  if (!texto) {
    return 'pendiente';
  }
  try {
    const guardado = JSON.parse(texto) as Partial<ConsentimientoGuardado> | null;
    const fecha = Date.parse(guardado?.fecha ?? '');
    const valida = !Number.isNaN(fecha) && fecha <= ahora.getTime() + 60_000;
    if (!valida || ahora.getTime() - fecha > VALIDEZ_MS) {
      return 'pendiente';
    }
    return guardado?.estado === 'aceptado' || guardado?.estado === 'rechazado'
      ? guardado.estado
      : 'pendiente';
  } catch {
    return 'pendiente';
  }
}

/** Lo que se guarda en el navegador al elegir. */
export function guardarConsentimiento(
  estado: ConsentimientoGuardado['estado'],
  ahora: Date,
): string {
  const guardado: ConsentimientoGuardado = { estado, fecha: ahora.toISOString() };
  return JSON.stringify(guardado);
}
