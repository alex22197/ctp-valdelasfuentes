import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { CompartirService } from '@shared/services/compartir.service';
import { PortapapelesService } from '@shared/services/portapapeles.service';
import type { TablaConvocatoria } from '../../interfaces/tabla-convocatoria.interface';
import { ImagenConvocatoriaService } from '../../services/imagen-convocatoria.service';

const NOMBRE_ARCHIVO = 'convocatoria.png';

/**
 * «Copiar para WhatsApp»: dibuja la convocatoria como la tabla del capitán y la copia al
 * portapapeles como imagen. Solo se activa con la convocatoria completa y guardada. La
 * imagen se enseña debajo para revisarla y, si el móvil no deja copiarla, compartirla o
 * descargarla.
 */
@Component({
  selector: 'ctp-copiar-convocatoria',
  templateUrl: './copiar-convocatoria.component.html',
  styleUrl: './copiar-convocatoria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopiarConvocatoriaComponent {
  private readonly imagenes = inject(ImagenConvocatoriaService);
  private readonly portapapeles = inject(PortapapelesService);
  private readonly compartirService = inject(CompartirService);

  readonly tabla = input.required<TablaConvocatoria | null>();
  readonly copiable = input.required<boolean>();

  protected readonly imagen = signal<{ url: string; archivo: File } | null>(null);
  protected readonly mensaje = signal<string | null>(null);
  protected readonly generando = signal(false);
  protected readonly puedeCompartir = computed(() => {
    const imagen = this.imagen();
    return imagen !== null && this.compartirService.puede(imagen.archivo);
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.cambiarImagen(null));
  }

  /**
   * La copia se pide al momento, dentro del toque, con la imagen todavía dibujándose: si se
   * esperara antes, Safari en el iPhone la rechazaría.
   */
  protected copiar(): void {
    const tabla = this.tabla();
    if (!tabla || !this.copiable() || this.generando()) {
      return;
    }
    this.generando.set(true);
    this.mensaje.set(null);
    const png = this.imagenes.generar(tabla);
    const copia = this.portapapeles.copiarImagen(png);
    void this.terminar(png, copia);
  }

  protected async compartir(): Promise<void> {
    const imagen = this.imagen();
    if (imagen) {
      await this.compartirService.compartir(imagen.archivo, 'Convocatoria');
    }
  }

  private async terminar(png: Promise<Blob>, copia: Promise<boolean>): Promise<void> {
    try {
      const blob = await png;
      this.cambiarImagen(new File([blob], NOMBRE_ARCHIVO, { type: 'image/png' }));
      const copiada = await copia;
      this.mensaje.set(
        copiada
          ? 'Imagen copiada. Pégala en el grupo de WhatsApp.'
          : 'Este navegador no deja copiar imágenes: compártela, descárgala o mantén pulsada la imagen para copiarla.',
      );
    } catch {
      this.mensaje.set('No se ha podido crear la imagen. Vuelve a intentarlo.');
    } finally {
      this.generando.set(false);
    }
  }

  private cambiarImagen(archivo: File | null): void {
    const anterior = this.imagen();
    if (anterior) {
      URL.revokeObjectURL(anterior.url);
    }
    this.imagen.set(archivo ? { url: URL.createObjectURL(archivo), archivo } : null);
  }
}
