import { ApplicationRef, DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Anima un cambio de la página con la View Transitions API del navegador: los elementos
 * que comparten `view-transition-name` antes y después del cambio «vuelan» de un sitio a
 * otro. Si el navegador no la soporta, el usuario pidió reducir el movimiento o ya hay una
 * transición en marcha, el cambio se aplica sin animación.
 */
@Injectable({ providedIn: 'root' })
export class TransicionVistaService {
  private readonly documento = inject(DOCUMENT);
  private readonly aplicacion = inject(ApplicationRef);
  private enCurso = false;

  /**
   * Ejecuta `cambio` animado. `antes` prepara el estado inicial (por ejemplo, poner el nombre
   * de transición al elemento que va a volar) y `despues` limpia al terminar.
   */
  ejecutar(cambio: () => void, antes?: () => void, despues?: () => void): void {
    if (!this.puedeAnimar()) {
      cambio();
      despues?.();
      return;
    }

    this.enCurso = true;
    antes?.();
    // Sin zone.js, el DOM se actualiza al hacer tick: el navegador captura así el estado
    // de antes y, dentro del callback, el de después.
    this.aplicacion.tick();
    const transicion = this.documento.startViewTransition(() => {
      cambio();
      this.aplicacion.tick();
    });
    void transicion.finished.finally(() => {
      this.enCurso = false;
      despues?.();
      this.aplicacion.tick();
    });
  }

  private puedeAnimar(): boolean {
    const ventana = this.documento.defaultView;
    return (
      !this.enCurso &&
      typeof this.documento.startViewTransition === 'function' &&
      !(ventana?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true)
    );
  }
}
