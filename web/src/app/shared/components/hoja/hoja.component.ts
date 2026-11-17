import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  effect,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

let siguienteId = 0;

/**
 * Hoja que sube desde abajo en el móvil (ventana centrada en pantallas grandes) con un título,
 * un botón de cerrar y lo que se le meta dentro. Quien la usa decide cuándo está `abierto`;
 * Escape y un toque fuera piden cerrarla con `cerrar`, para que haya un único estado.
 */
@Component({
  selector: 'ctp-hoja',
  templateUrl: './hoja.component.html',
  styleUrl: './hoja.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HojaComponent {
  readonly abierto = input(false);
  readonly titulo = input.required<string>();
  readonly cerrar = output();

  protected readonly idTitulo = `titulo-hoja-${++siguienteId}`;

  private readonly documento = inject(DOCUMENT);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly tituloElemento = viewChild.required<ElementRef<HTMLElement>>('tituloElemento');

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.documento.documentElement.classList.remove('sin-desplazamiento'),
    );
    effect(() => {
      const dialogo = this.dialogo().nativeElement;
      if (this.abierto()) {
        this.abrir(dialogo);
      } else if (dialogo.open) {
        dialogo.close();
        this.documento.documentElement.classList.remove('sin-desplazamiento');
      }
    });
  }

  protected cancelar(evento: Event): void {
    evento.preventDefault();
    this.cerrar.emit();
  }

  /** Un toque en el fondo oscuro (fuera del contenido) cierra la hoja. */
  protected tocarFondo(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) {
      this.cerrar.emit();
    }
  }

  private abrir(dialogo: HTMLDialogElement): void {
    if (dialogo.open) {
      return;
    }
    if (typeof dialogo.showModal === 'function') {
      dialogo.showModal();
    } else {
      dialogo.setAttribute('open', '');
    }
    // En iOS la página de detrás seguiría desplazándose sin esto.
    this.documento.documentElement.classList.add('sin-desplazamiento');
    // Foco en el título, no en el primer campo: así no sale el teclado tapando la hoja.
    this.tituloElemento().nativeElement.focus();
  }
}
