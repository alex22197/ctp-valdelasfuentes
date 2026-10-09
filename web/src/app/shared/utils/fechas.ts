import { ZONA_HORARIA } from '@core/config/sitio.constants';

/** Fecha de hoy (o de `fecha`) en Madrid, en formato AAAA-MM-DD. */
export function fechaIsoEnMadrid(fecha: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(fecha);
}

/**
 * Texto de la fecha de una confrontación, con el detalle que se conozca:
 * - «Sábado 10 de octubre, 12:00» si ya hay día y hora.
 * - «Fin de semana del 10 de octubre» si solo se conoce la jornada del calendario.
 * - «Fecha por confirmar» si no hay nada.
 */
export function describirFechaConfrontacion(
  fechaHora: string | null,
  fechaPrevista: string | null,
): string {
  if (fechaHora) {
    return describirDiaYHora(new Date(fechaHora));
  }
  if (fechaPrevista) {
    return `Fin de semana del ${describirDiaYMes(fechaPrevista)}`;
  }
  return 'Fecha por confirmar';
}

/**
 * Fecha corta para mensajes, como la escribe el capitán en WhatsApp:
 * «sábado 12:00», «fin de semana del 17 de octubre» o «fecha por confirmar».
 */
export function describirFechaCorta(
  fechaHora: string | null,
  fechaPrevista: string | null,
): string {
  if (fechaHora) {
    const partes = new Intl.DateTimeFormat('es-ES', {
      timeZone: ZONA_HORARIA,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(new Date(fechaHora));
    const parte = (tipo: Intl.DateTimeFormatPartTypes): string =>
      partes.find((p) => p.type === tipo)?.value ?? '';
    return `${parte('weekday')} ${parte('hour')}:${parte('minute')}`;
  }
  const larga = describirFechaConfrontacion(null, fechaPrevista);
  return larga.charAt(0).toLowerCase() + larga.slice(1);
}

function describirDiaYHora(fecha: Date): string {
  const partes = new Intl.DateTimeFormat('es-ES', {
    timeZone: ZONA_HORARIA,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(fecha);
  const parte = (tipo: Intl.DateTimeFormatPartTypes): string =>
    partes.find((p) => p.type === tipo)?.value ?? '';
  const diaSemana = parte('weekday');
  const diaSemanaCapitalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  return `${diaSemanaCapitalizado} ${parte('day')} de ${parte('month')}, ${parte('hour')}:${parte('minute')}`;
}

/** «10 de octubre» a partir de «2026-10-10», sin desfases por zona horaria. */
function describirDiaYMes(fechaIso: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'UTC',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${fechaIso}T00:00:00Z`));
}
