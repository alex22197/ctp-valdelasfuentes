import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { horaMadridAIso, isoAHoraMadrid } from '@shared/utils/hora-madrid';
import type { FormularioJornada } from '../interfaces/formulario-jornada.interface';

type Jornada = Pick<
  ConfrontacionNuestroEquipo,
  'fechaHora' | 'fechaPrevista' | 'sede' | 'numeroPistas'
>;

/**
 * El formulario relleno con lo que ya se sabe. Sin hora todavía, el día parte del fin de
 * semana del calendario oficial, que es lo más probable.
 */
export function formularioDesdeJornada(jornada: Jornada): FormularioJornada {
  const momento = jornada.fechaHora ? isoAHoraMadrid(jornada.fechaHora) : null;
  return {
    dia: momento?.dia ?? jornada.fechaPrevista ?? '',
    hora: momento?.hora ?? '',
    sede: jornada.sede ?? '',
    pistas: jornada.numeroPistas?.toString() ?? '',
  };
}

/**
 * Los datos para guardar, o el motivo por el que no se puede. El día y la hora van juntos: con
 * uno solo no se sabe cuándo se juega. Lo vacío queda «por confirmar».
 */
export function leerFormularioJornada(
  formulario: FormularioJornada,
): { readonly datos: DatosConfrontacion } | { readonly error: string } {
  const { dia, hora } = formulario;
  if (Boolean(dia) !== Boolean(hora)) {
    return { error: 'Pon el día y la hora, o deja los dos vacíos si aún no se saben.' };
  }
  return {
    datos: {
      fechaHora: dia && hora ? horaMadridAIso({ dia, hora }) : null,
      sede: formulario.sede.trim() || null,
      numeroPistas: formulario.pistas ? Number(formulario.pistas) : null,
    },
  };
}
