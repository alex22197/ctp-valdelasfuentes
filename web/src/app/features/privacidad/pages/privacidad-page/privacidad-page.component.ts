import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FECHA_PRIVACIDAD, RESPONSABLE_DATOS } from '@core/config/sitio.constants';

/**
 * Política de privacidad: qué datos guarda la web, para qué y a quién pedir que se cambien o
 * se borren. Google la exige para que cualquiera pueda entrar con su cuenta.
 */
@Component({
  selector: 'ctp-privacidad-page',
  imports: [RouterLink],
  templateUrl: './privacidad-page.component.html',
  styleUrl: './privacidad-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacidadPageComponent {
  protected readonly responsable = RESPONSABLE_DATOS;
  protected readonly fecha = FECHA_PRIVACIDAD;
}
