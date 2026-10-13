import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Abre el menú de compartir del móvil con un archivo (por ejemplo, para mandar una imagen
 * por WhatsApp). En ordenadores y navegadores sin soporte, `puede` devuelve `false`.
 */
@Injectable({ providedIn: 'root' })
export class CompartirService {
  private readonly navegador = inject(DOCUMENT).defaultView?.navigator;

  puede(archivo: File): boolean {
    return !!this.navegador?.canShare?.({ files: [archivo] });
  }

  /** `true` si se compartió; `false` si el usuario lo canceló o no se pudo. */
  async compartir(archivo: File, titulo: string): Promise<boolean> {
    if (!this.puede(archivo)) {
      return false;
    }
    try {
      await this.navegador?.share({ files: [archivo], title: titulo });
      return true;
    } catch {
      return false;
    }
  }
}
