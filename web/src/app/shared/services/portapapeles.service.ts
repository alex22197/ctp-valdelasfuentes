import { DOCUMENT, Injectable, inject } from '@angular/core';

/** `ClipboardItem.supports` solo existe en navegadores recientes. */
type ClipboardItemConSoporte = typeof ClipboardItem & { supports?: (tipo: string) => boolean };

/**
 * Copia una imagen al portapapeles. El navegador solo lo permite en HTTPS (o localhost) y
 * dentro del toque del usuario: por eso recibe la imagen como promesa y pide la copia al
 * momento, antes de esperar a que esté dibujada (Safari en iPhone lo exige). Si no se
 * puede, devuelve `false` para que la página ofrezca compartirla o guardarla.
 */
@Injectable({ providedIn: 'root' })
export class PortapapelesService {
  private readonly documento = inject(DOCUMENT);

  copiarImagen(png: Promise<Blob>): Promise<boolean> {
    const portapapeles = this.documento.defaultView?.navigator.clipboard;
    const Item = globalThis.ClipboardItem as ClipboardItemConSoporte | undefined;
    if (!portapapeles?.write || !Item || Item.supports?.('image/png') === false) {
      return Promise.resolve(false);
    }
    try {
      return portapapeles.write([new Item({ 'image/png': png })]).then(
        () => true,
        () => false,
      );
    } catch {
      return Promise.resolve(false);
    }
  }
}
