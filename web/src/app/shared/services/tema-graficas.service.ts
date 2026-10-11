import { DOCUMENT, Injectable, inject } from '@angular/core';
import type { ColoresGraficas } from '../utils/graficas/interfaces/colores-graficas.interface';
import { leerColoresGraficas } from '../utils/graficas/opciones-comunes';

/**
 * Colores de las gráficas (los tokens del sistema de diseño) y si se pueden animar.
 * Se provee en la página de estadísticas.
 */
@Injectable()
export class TemaGraficasService {
  private readonly ventana = inject(DOCUMENT).defaultView;

  readonly colores: ColoresGraficas = leerColoresGraficas(
    this.ventana
      ? this.ventana.getComputedStyle(this.ventana.document.documentElement)
      : { getPropertyValue: () => '' },
  );

  /** Sin animación si el móvil tiene activado «reducir movimiento» (ADR 0010). */
  readonly animar: boolean = !this.ventana?.matchMedia?.('(prefers-reduced-motion: reduce)')
    .matches;
}
