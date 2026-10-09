import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  type ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { GrupoOpciones } from '../../interfaces/grupo-opciones.interface';
import { filtrarOpciones } from '../../utils/opciones-hueco';

/**
 * Panel para elegir quién juega en un lado de la pista. En el móvil sube desde abajo como
 * una hoja; en pantallas grandes flota centrado. Es un `<dialog>` modal: el navegador
 * gestiona el foco y lo devuelve a la ficha que lo abrió al cerrarse.
 */
@Component({
  selector: 'ctp-selector-jugadores',
  templateUrl: './selector-jugadores.component.html',
  styleUrl: './selector-jugadores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorJugadoresComponent {
  readonly abierto = input(false);
  /** «Revés de Masculino, pareja 1». */
  readonly titulo = input('');
  readonly grupos = input<readonly GrupoOpciones[]>([]);
  /** Jugador que ocupa ahora ese lado, si hay. */
  readonly idSeleccionado = input<string | null>(null);
  /** Jugador que va a volar a la pista, para darle su nombre de transición. */
  readonly idEnVuelo = input<string | null>(null);
  readonly elegir = output<string | null>();
  readonly cerrar = output();

  private readonly documento = inject(DOCUMENT);
  private readonly dialogo = viewChild.required<ElementRef<HTMLDialogElement>>('dialogo');
  private readonly cabecera = viewChild.required<ElementRef<HTMLElement>>('cabecera');

  protected readonly busqueda = signal('');
  protected readonly filtrados = computed(() => filtrarOpciones(this.grupos(), this.busqueda()));

  constructor() {
    inject(DestroyRef).onDestroy(() =>
      this.documento.documentElement.classList.remove('sin-desplazamiento'),
    );
    effect(() => {
      const dialogo = this.dialogo().nativeElement;
      if (this.abierto()) {
        this.abrirDialogo(dialogo);
      } else if (dialogo.open) {
        dialogo.close();
        this.documento.documentElement.classList.remove('sin-desplazamiento');
      }
    });
  }

  protected buscar(evento: Event): void {
    this.busqueda.set((evento.target as HTMLInputElement).value);
  }

  /** Escape: el componente padre decide cerrar, para mantener un único estado. */
  protected cancelar(evento: Event): void {
    evento.preventDefault();
    this.cerrar.emit();
  }

  /** Un toque en el fondo oscuro (fuera del contenido) cierra el panel. */
  protected tocarFondo(evento: MouseEvent): void {
    if (evento.target === this.dialogo().nativeElement) {
      this.cerrar.emit();
    }
  }

  private abrirDialogo(dialogo: HTMLDialogElement): void {
    if (dialogo.open) {
      return;
    }
    this.busqueda.set('');
    if (typeof dialogo.showModal === 'function') {
      dialogo.showModal();
    } else {
      dialogo.setAttribute('open', '');
    }
    // En iOS la página de detrás seguiría desplazándose sin esto.
    this.documento.documentElement.classList.add('sin-desplazamiento');
    // Foco en el título, no en el buscador: así no sale el teclado tapando la lista.
    this.cabecera().nativeElement.querySelector<HTMLElement>('h2')?.focus();
  }
}
