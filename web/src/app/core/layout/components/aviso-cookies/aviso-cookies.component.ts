import {
  ChangeDetectionStrategy,
  Component,
  type ElementRef,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConsentimientoService } from '@core/analitica/consentimiento.service';

/**
 * Pregunta si se pueden medir las visitas, con «Aceptar» y «Rechazar» igual de visibles. No
 * tapa la navegación ni bloquea la página: se puede seguir usando sin contestar.
 */
@Component({
  selector: 'ctp-aviso-cookies',
  imports: [RouterLink],
  templateUrl: './aviso-cookies.component.html',
  styleUrl: './aviso-cookies.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvisoCookiesComponent {
  protected readonly consentimiento = inject(ConsentimientoService);
  private readonly aviso = viewChild<ElementRef<HTMLElement>>('aviso');

  constructor() {
    // Al pedir cambiar la elección desde el pie, el foco va al aviso.
    effect(() => {
      if (this.consentimiento.avisoReabierto()) {
        this.aviso()?.nativeElement.focus();
      }
    });
  }
}
