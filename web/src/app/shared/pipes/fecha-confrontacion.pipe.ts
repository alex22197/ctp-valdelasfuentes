import { Pipe, type PipeTransform } from '@angular/core';
import { describirFechaConfrontacion } from '@shared/utils/fechas';

interface ConFechas {
  readonly fechaHora: string | null;
  readonly fechaPrevista: string | null;
}

/** Uso: `{{ confrontacion | fechaConfrontacion }}`. Ver `describirFechaConfrontacion`. */
@Pipe({ name: 'fechaConfrontacion' })
export class FechaConfrontacionPipe implements PipeTransform {
  transform(confrontacion: ConFechas): string {
    return describirFechaConfrontacion(confrontacion.fechaHora, confrontacion.fechaPrevista);
  }
}
