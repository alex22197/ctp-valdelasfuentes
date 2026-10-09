import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { PortapapelesService } from '@shared/services/portapapeles.service';
import { clavePartido } from '@shared/utils/etiquetas-partido';
import { ComprobacionAlineacionComponent } from '../../components/comprobacion-alineacion/comprobacion-alineacion.component';
import { PistaEditableComponent } from '../../components/pista-editable/pista-editable.component';
import { RespuestasConvocatoriaComponent } from '../../components/respuestas-convocatoria/respuestas-convocatoria.component';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';
import { DatosConvocatoriaService } from '../../services/datos-convocatoria.service';
import { opcionesParaPista } from '../../utils/opciones-hueco';

/**
 * Convocatoria de una jornada, vista de capitán: alineación sobre las pistas, comprobación
 * de normativa, publicación y textos para WhatsApp, y las respuestas a la encuesta.
 */
@Component({
  selector: 'ctp-convocatoria-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    FechaConfrontacionPipe,
    ComprobacionAlineacionComponent,
    PistaEditableComponent,
    RespuestasConvocatoriaComponent,
  ],
  providers: [DatosConvocatoriaService],
  templateUrl: './convocatoria-page.component.html',
  styleUrl: './convocatoria-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaPageComponent {
  protected readonly datos = inject(DatosConvocatoriaService);
  private readonly portapapeles = inject(PortapapelesService);

  protected readonly clavePartido = clavePartido;
  /** Confirmación tras copiar, o el texto para copiar a mano si el navegador no deja. */
  protected readonly copiado = signal<string | null>(null);
  protected readonly textoManual = signal<string | null>(null);

  protected opciones(hueco: HuecoAlineacion): ReturnType<typeof opcionesParaPista> {
    return opcionesParaPista(
      hueco.tipo,
      clavePartido(hueco),
      this.datos.huecos(),
      this.datos.jugadores(),
    );
  }

  protected errores(hueco: HuecoAlineacion): string[] {
    const clave = clavePartido(hueco);
    return this.datos
      .problemas()
      .filter((problema) => problema.clave === clave)
      .map((problema) => problema.mensaje);
  }

  protected async copiar(texto: string, confirmacion: string): Promise<void> {
    const ok = await this.portapapeles.copiar(texto);
    this.copiado.set(ok ? confirmacion : null);
    this.textoManual.set(ok ? null : texto);
  }
}
