import { Injectable, signal } from '@angular/core';

/** Por debajo de este tiempo la espera ni se nota: mostrar algo solo sería un parpadeo. */
export const ESPERA_ANTES_DE_MOSTRAR_MS = 400;
/** Una vez a la vista, lo que tarda Libra en ir a por la bola y que se vea. */
export const TIEMPO_MINIMO_A_LA_VISTA_MS = 1000;

/**
 * Cuenta las peticiones a Supabase que están en marcha y decide cuándo se ve la espera
 * (Libra corriendo delante del contenido). Solo se muestra si la espera dura más de
 * `ESPERA_ANTES_DE_MOSTRAR_MS` y, una vez a la vista, se queda al menos
 * `TIEMPO_MINIMO_A_LA_VISTA_MS`, para que no parpadee.
 */
@Injectable({ providedIn: 'root' })
export class PeticionesEnCursoService {
  private readonly esperaVisible = signal(false);
  private enCurso = 0;
  private visibleDesde = 0;
  private temporizador: ReturnType<typeof setTimeout> | undefined;

  readonly visible = this.esperaVisible.asReadonly();

  /** El `fetch` que usa el cliente de Supabase: el del navegador, contando cada petición. */
  readonly fetch: typeof fetch = (entrada, opciones) => {
    this.empezar();
    return globalThis.fetch(entrada, opciones).finally(() => this.terminar());
  };

  private empezar(): void {
    this.enCurso++;
    if (this.enCurso > 1) {
      return;
    }
    clearTimeout(this.temporizador);
    if (!this.esperaVisible()) {
      this.temporizador = setTimeout(() => {
        this.visibleDesde = Date.now();
        this.esperaVisible.set(true);
      }, ESPERA_ANTES_DE_MOSTRAR_MS);
    }
  }

  private terminar(): void {
    this.enCurso = Math.max(0, this.enCurso - 1);
    if (this.enCurso > 0) {
      return;
    }
    clearTimeout(this.temporizador);
    if (this.esperaVisible()) {
      const queda = TIEMPO_MINIMO_A_LA_VISTA_MS - (Date.now() - this.visibleDesde);
      this.temporizador = setTimeout(() => this.esperaVisible.set(false), Math.max(0, queda));
    }
  }
}
