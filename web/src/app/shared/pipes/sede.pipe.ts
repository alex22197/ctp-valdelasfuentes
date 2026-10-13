import { Pipe, type PipeTransform } from '@angular/core';
import type { SedeDescrita } from '@shared/utils/interfaces/sede-descrita.interface';
import { describirSede } from '@shared/utils/sede';

/** Uso: `@if (confrontacion.sede | sede; as sede) { … }`. Ver `describirSede`. */
@Pipe({ name: 'sede' })
export class SedePipe implements PipeTransform {
  transform(sede: string | null): SedeDescrita | null {
    return describirSede(sede);
  }
}
