import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Copia texto al portapapeles. El navegador solo lo permite en HTTPS (o localhost) y tras
 * un toque del usuario; si no se puede, devuelve `false` para que la página ofrezca el
 * texto para copiarlo a mano.
 */
@Injectable({ providedIn: 'root' })
export class PortapapelesService {
  private readonly documento = inject(DOCUMENT);

  async copiar(texto: string): Promise<boolean> {
    const portapapeles = this.documento.defaultView?.navigator.clipboard;
    if (!portapapeles) {
      return false;
    }
    try {
      await portapapeles.writeText(texto);
      return true;
    } catch {
      return false;
    }
  }
}
