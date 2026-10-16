import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EsperaLibraComponent } from '@core/layout/components/espera-libra/espera-libra.component';
import { CabeceraSitioComponent } from '@core/layout/components/cabecera-sitio/cabecera-sitio.component';
import { NavegacionInferiorComponent } from '@core/layout/components/navegacion-inferior/navegacion-inferior.component';

/**
 * Esqueleto de la aplicación: cabecera, contenido de la ruta, navegación móvil y la espera
 * con Libra cuando una petición tarda.
 */
@Component({
  selector: 'ctp-root',
  imports: [
    RouterLink,
    RouterOutlet,
    CabeceraSitioComponent,
    NavegacionInferiorComponent,
    EsperaLibraComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
