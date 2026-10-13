import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconoComponent } from '@shared/components/icono/icono.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FechaConfrontacionPipe } from '@shared/pipes/fecha-confrontacion.pipe';
import { TransicionVistaService } from '@shared/services/transicion-vista.service';
import { clavePartido, etiquetaPartido } from '@shared/utils/etiquetas-partido';
import { ComprobacionAlineacionComponent } from '../../components/comprobacion-alineacion/comprobacion-alineacion.component';
import { CopiarConvocatoriaComponent } from '../../components/copiar-convocatoria/copiar-convocatoria.component';
import { PistaEditableComponent } from '../../components/pista-editable/pista-editable.component';
import { SelectorJugadoresComponent } from '../../components/selector-jugadores/selector-jugadores.component';
import type { CambioHueco } from '../../interfaces/cambio-hueco.interface';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';
import type { PosicionHueco } from '../../interfaces/posicion-hueco.interface';
import { DatosConvocatoriaService } from '../../services/datos-convocatoria.service';
import { ImagenConvocatoriaService } from '../../services/imagen-convocatoria.service';
import { opcionesParaPista } from '../../utils/opciones-hueco';

/**
 * Convocatoria de una jornada, vista de capitán: alineación sobre las pistas, comprobación
 * de normativa, publicación y la imagen de la convocatoria para WhatsApp.
 */
@Component({
  selector: 'ctp-convocatoria-page',
  imports: [
    RouterLink,
    IconoComponent,
    MensajeEstadoComponent,
    FechaConfrontacionPipe,
    ComprobacionAlineacionComponent,
    CopiarConvocatoriaComponent,
    PistaEditableComponent,
    SelectorJugadoresComponent,
  ],
  providers: [DatosConvocatoriaService, ImagenConvocatoriaService],
  templateUrl: './convocatoria-page.component.html',
  styleUrl: './convocatoria-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaPageComponent {
  protected readonly datos = inject(DatosConvocatoriaService);
  private readonly transicion = inject(TransicionVistaService);

  protected readonly clavePartido = clavePartido;
  /** Lado de la pista cuyo panel de jugadores está abierto. */
  protected readonly abierto = signal<PosicionHueco | null>(null);
  /** Jugador que está volando del panel a la pista durante la animación. */
  protected readonly enVuelo = signal<CambioHueco | null>(null);

  private readonly huecoAbierto = computed(() => {
    const abierto = this.abierto();
    return this.datos.huecos().find((hueco) => clavePartido(hueco) === abierto?.clave) ?? null;
  });
  protected readonly tituloSelector = computed(() => {
    const hueco = this.huecoAbierto();
    const lado = this.abierto()?.lado === 'reves' ? 'Revés' : 'Drive';
    return hueco ? `${lado} de ${etiquetaPartido(hueco.tipo, hueco.numero)}` : '';
  });
  protected readonly opcionesSelector = computed(() => {
    const hueco = this.huecoAbierto();
    return hueco
      ? opcionesParaPista(
          hueco.tipo,
          clavePartido(hueco),
          this.datos.huecos(),
          this.datos.jugadores(),
        )
      : [];
  });
  protected readonly idSeleccionado = computed(() => {
    const hueco = this.huecoAbierto();
    const lado = this.abierto()?.lado;
    return hueco ? (lado === 'reves' ? hueco.idReves : hueco.idDrive) : null;
  });

  protected elegir(idJugador: string | null): void {
    const abierto = this.abierto();
    if (!abierto) {
      return;
    }
    const cambio: CambioHueco = { ...abierto, idJugador };
    this.transicion.ejecutar(
      () => {
        this.datos.cambiarHueco(cambio);
        this.abierto.set(null);
      },
      () => this.enVuelo.set(cambio),
      () => this.enVuelo.set(null),
    );
  }

  protected errores(hueco: HuecoAlineacion): string[] {
    const clave = clavePartido(hueco);
    return this.datos
      .problemas()
      .filter((problema) => problema.clave === clave)
      .map((problema) => problema.mensaje);
  }
}
