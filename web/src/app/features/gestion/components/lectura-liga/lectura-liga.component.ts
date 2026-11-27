import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { describirFechaConfrontacion } from '@shared/utils/fechas';
import type { EstadoLecturaLiga } from '../../interfaces/estado-lectura-liga.type';

/**
 * Cómo fue la última lectura de la web de la liga (resultados de los demás y clasificación).
 * Si todo va bien es una línea discreta; si falló, dejó avisos o lleva días sin leer, un
 * recuadro que se ve.
 */
@Component({
  selector: 'ctp-lectura-liga',
  templateUrl: './lectura-liga.component.html',
  styleUrl: './lectura-liga.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LecturaLigaComponent {
  readonly estado = input.required<EstadoLecturaLiga>();

  /** «el miércoles 25 de noviembre, 15:03». */
  protected cuando(momento: string): string {
    const texto = describirFechaConfrontacion(momento, null);
    return `el ${texto.charAt(0).toLowerCase()}${texto.slice(1)}`;
  }
}
