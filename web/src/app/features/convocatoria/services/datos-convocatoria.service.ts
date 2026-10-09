import { Injectable, computed, inject, linkedSignal, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AlineacionesService } from '@data-access/alineaciones/alineaciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { DisponibilidadService } from '@data-access/disponibilidad/disponibilidad.service';
import { ResultadosService } from '@data-access/resultados/resultados.service';
import type { CambioHueco } from '../interfaces/cambio-hueco.interface';
import { comprobarAlineacion } from '../utils/comprobar-alineacion';
import { agruparRespuestas } from '../utils/grupos-respuestas';
import {
  aplicarCambio,
  huecosDesdePartidos,
  mismasParejas,
  parejasParaGuardar,
} from '../utils/huecos-alineacion';
import { textoConvocatoria, textoRecordatorio } from '../utils/texto-whatsapp';

/**
 * Datos de la convocatoria de la confrontación de la ruta: la alineación que se está
 * editando, las respuestas a la encuesta y los textos para WhatsApp. Se provee en la
 * propia página, así que vive y muere con ella.
 */
@Injectable()
export class DatosConvocatoriaService {
  private readonly confrontaciones = inject(ConfrontacionesService);
  private readonly disponibilidad = inject(DisponibilidadService);
  private readonly resultados = inject(ResultadosService);
  private readonly alineaciones = inject(AlineacionesService);

  private readonly idConfrontacion = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((parametros) => parametros.get('idConfrontacion'))),
  );
  private readonly id = computed(() => this.idConfrontacion() ?? undefined);

  readonly confrontacion = resource({
    params: this.id,
    loader: ({ params: id }) => this.confrontaciones.obtenerConfrontacion(id),
  });
  readonly convocables = resource({
    params: this.id,
    loader: ({ params: id }) => this.disponibilidad.obtenerConvocables(id),
  });
  /** Todas las pistas del formato con su pareja y resultado (para bloquear los WO). */
  readonly partidos = resource({
    params: this.id,
    loader: ({ params: id }) => this.resultados.obtenerResultados(id),
  });

  readonly confrontacionActual = computed(() =>
    this.confrontacion.hasValue() ? this.confrontacion.value() : null,
  );
  readonly jugadores = computed(() =>
    this.convocables.hasValue() ? this.convocables.value() : [],
  );
  readonly huecosGuardados = computed(() =>
    huecosDesdePartidos(this.partidos.hasValue() ? this.partidos.value() : []),
  );
  /** La alineación tal como se está editando; vuelve a lo guardado al recargar. */
  readonly huecos = linkedSignal(() => this.huecosGuardados());

  readonly hayCambios = computed(() => !mismasParejas(this.huecos(), this.huecosGuardados()));
  readonly problemas = computed(() => comprobarAlineacion(this.huecos(), this.jugadores()));
  readonly hayErrores = computed(() => this.problemas().some((p) => p.gravedad === 'error'));
  readonly grupos = computed(() => agruparRespuestas(this.jugadores()));

  /** Texto de lo guardado: mientras hay cambios sin guardar no se ofrece copiarlo. */
  readonly textoConvocatoria = computed(() => {
    const confrontacion = this.confrontacionActual();
    return confrontacion
      ? textoConvocatoria(confrontacion, this.huecosGuardados(), this.jugadores())
      : '';
  });
  readonly textoRecordatorio = computed(() => {
    const confrontacion = this.confrontacionActual();
    const sinResponder = this.grupos().find((g) => g.variante === 'sin-responder');
    return confrontacion ? textoRecordatorio(confrontacion, sinResponder?.jugadores ?? []) : '';
  });

  readonly ocupado = signal(false);
  readonly error = signal<string | null>(null);

  cambiarHueco(cambio: CambioHueco): void {
    this.huecos.update((huecos) => aplicarCambio(huecos, cambio));
  }

  descartarCambios(): void {
    this.huecos.set(this.huecosGuardados());
    this.error.set(null);
  }

  /** Guarda la alineación entera; los colocados quedan convocados (ADR 0009). */
  async guardar(): Promise<void> {
    if (this.hayErrores()) {
      return;
    }
    await this.ejecutar(async (id) => {
      await this.alineaciones.guardarAlineacion(id, parejasParaGuardar(this.huecos()));
      this.partidos.reload();
      this.convocables.reload();
    });
  }

  async cambiarPublicacion(publicada: boolean): Promise<void> {
    await this.ejecutar(async (id) => {
      await this.alineaciones.publicarConvocatoria(id, publicada);
      this.confrontacion.reload();
    });
  }

  private async ejecutar(accion: (id: string) => Promise<void>): Promise<void> {
    const id = this.id();
    if (!id || this.ocupado()) {
      return;
    }
    this.ocupado.set(true);
    this.error.set(null);
    try {
      await accion(id);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.');
    } finally {
      this.ocupado.set(false);
    }
  }
}
