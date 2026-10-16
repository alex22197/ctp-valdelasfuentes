import type { TablesUpdate } from '@core/supabase/interfaces/database.types';
import type { DatosConfrontacion } from './interfaces/datos-confrontacion.interface';

export type FilaDatosConfrontacion = Required<
  Pick<TablesUpdate<'confrontacion'>, 'fecha_hora' | 'sede' | 'num_pistas'>
>;

/** Los datos de una jornada para guardarlos. Una sede en blanco vuelve a «por confirmar». */
export function mapearFilaDatosConfrontacion(datos: DatosConfrontacion): FilaDatosConfrontacion {
  return {
    fecha_hora: datos.fechaHora,
    sede: datos.sede?.trim() || null,
    num_pistas: datos.numeroPistas,
  };
}
