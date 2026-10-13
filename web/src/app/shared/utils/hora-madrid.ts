import { ZONA_HORARIA } from '@core/config/sitio.constants';

/** Un momento escrito como lo ve alguien en Madrid: «2026-10-24» y «12:00». */
export interface DiaYHora {
  readonly dia: string;
  readonly hora: string;
}

const PARTES = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA_HORARIA,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

/**
 * El instante (ISO 8601, en UTC) de un día y una hora de Madrid. El desfase sale de esa
 * fecha, no de hoy: el 24 de octubre de 2026 las 12:00 son las 10:00 UTC y el 31, tras el
 * cambio de hora, las 11:00 UTC.
 */
export function horaMadridAIso({ dia, hora }: DiaYHora): string {
  const [anio, mes, diaMes] = dia.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  const comoUtc = Date.UTC(anio, mes - 1, diaMes, horas, minutos);
  // Dos pasadas: la primera estima el desfase y la segunda lo corrige si el cambio de hora
  // cae entre medias.
  let instante = comoUtc - desfaseEnMadrid(comoUtc);
  instante = comoUtc - desfaseEnMadrid(instante);
  return new Date(instante).toISOString();
}

/** El día y la hora en Madrid de un instante ISO 8601, para rellenar un formulario. */
export function isoAHoraMadrid(iso: string): DiaYHora {
  const p = partesEnMadrid(new Date(iso).getTime());
  return { dia: `${p.year}-${p.month}-${p.day}`, hora: `${p.hour}:${p.minute}` };
}

/** Milisegundos que Madrid va por delante de UTC en ese instante (1 o 2 horas). */
function desfaseEnMadrid(instante: number): number {
  const p = partesEnMadrid(instante);
  const relojMadrid = Date.UTC(
    Number(p.year),
    Number(p.month) - 1,
    Number(p.day),
    Number(p.hour),
    Number(p.minute),
    Number(p.second),
  );
  return relojMadrid - Math.floor(instante / 1000) * 1000;
}

type PartesEnMadrid = Record<'year' | 'month' | 'day' | 'hour' | 'minute' | 'second', string>;

function partesEnMadrid(instante: number): PartesEnMadrid {
  const partes = PARTES.formatToParts(new Date(instante));
  const valor = (tipo: keyof PartesEnMadrid): string =>
    partes.find((parte) => parte.type === tipo)?.value ?? '00';
  return {
    year: valor('year'),
    month: valor('month'),
    day: valor('day'),
    hour: valor('hour'),
    minute: valor('minute'),
    second: valor('second'),
  };
}
