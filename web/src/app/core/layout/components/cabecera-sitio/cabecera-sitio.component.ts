import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { CuentasNuevasService } from '@core/auth/cuentas-nuevas.service';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { ENLACES_NAVEGACION } from '../../enlaces-navegacion';

/**
 * Cabecera con el escudo, el menú (en escritorio) y el acceso a la cuenta. Al administrador,
 * «Gestión» le avisa con un globo de las cuentas nuevas que esperan su decisión.
 */
@Component({
  selector: 'ctp-cabecera-sitio',
  imports: [RouterLink, RouterLinkActive, IconoComponent],
  templateUrl: './cabecera-sitio.component.html',
  styleUrl: './cabecera-sitio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CabeceraSitioComponent {
  protected readonly auth = inject(AuthService);
  protected readonly cuentasNuevas = inject(CuentasNuevasService);
  protected readonly enlaces = ENLACES_NAVEGACION;

  protected readonly etiquetaGestion = computed(() => {
    const numero = this.cuentasNuevas.numero();
    if (numero === 0) {
      return 'Gestión';
    }
    return `Gestión, ${numero} ${numero === 1 ? 'cuenta nueva' : 'cuentas nuevas'}`;
  });
}
