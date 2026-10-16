import { Injectable, computed, inject, linkedSignal, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { AlineacionesService } from '@data-access/alineaciones/alineaciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { DisponibilidadService } from '@data-access/disponibilidad/disponibilidad.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { ResultadosService } from '@data-access/resultados/resultados.service';
import type { CambioHueco } from '../interfaces/cambio-hueco.interface';
import { comprobarAlineacion } from '../utils/comprobar-alineacion';
import {
  aplicarCambio,
  huecosDesdePartidos,
  mismasParejas,
  parejasParaGuardar,
} from '../utils/huecos-alineacion';
import { construirTablaConvocatoria, convocatoriaCopiable } from '../utils/tabla-convocatoria';

/**
 * Datos de la convocatoria de la confrontación de la ruta: la alineación que se está
 * editando y la tabla de la convocatoria para WhatsApp. Se provee en la
 * propia página, así que vive y muere con ella.
 */
@Injectable()
export class DatosConvocatoriaService {
  private readonly confrontaciones = inject(ConfrontacionesService);
  private readonly disponibilidad = inject(DisponibilidadService);
  private readonly resultados = inject(ResultadosService);
  private readonly alineaciones = inject(AlineacionesService);
  private readonly jugadoresService = inject(JugadoresService);

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
  /** Nombre para mostrar de cada jugador, por id. */
  readonly nombres = computed<ReadonlyMap<string, string>>(
    () => new Map(this.jugadores().map((jugador) => [jugador.id, jugador.nombreMostrar])),
  );
  readonly huecosGuardados = computed(() =>
    huecosDesdePartidos(this.partidos.hasValue() ? this.partidos.value() : []),
  );
  /** La alineación tal como se está editando; vuelve a lo guardado al recargar. */
  readonly huecos = linkedSignal(() => this.huecosGuardados());

  readonly hayCambios = computed(() => !mismasParejas(this.huecos(), this.huecosGuardados()));
  readonly problemas = computed(() => comprobarAlineacion(this.huecos(), this.jugadores()));
  readonly hayErrores = computed(() => this.problemas().some((p) => p.gravedad === 'error'));

  /** Nombres completos para la imagen; si no se pueden leer, se usan los cortos. */
  private readonly nombresCompletos = resource({
    params: () => (this.convocables.hasValue() ? this.jugadores().map((j) => j.id) : undefined),
    loader: ({ params: ids }) => this.jugadoresService.obtenerNombresCompletos(ids),
  });

  /** Tabla de lo guardado: mientras hay cambios sin guardar no se puede copiar. */
  readonly tabla = computed(() => {
    const confrontacion = this.confrontacionActual();
    if (!confrontacion) {
      return null;
    }
    const completos = this.nombresCompletos.hasValue()
      ? this.nombresCompletos.value()
      : new Map<string, string>();
    const nombres = new Map(
      this.jugadores().map((j) => [j.id, completos.get(j.id) ?? j.nombreMostrar]),
    );
    return construirTablaConvocatoria(confrontacion, this.huecosGuardados(), nombres);
  });

  readonly copiable = computed(() => convocatoriaCopiable(this.huecos(), this.hayCambios()));

  readonly ocupado = signal(false);
  /**
   * Guardando, o recargando lo guardado: la alineación no se puede tocar, porque al llegar los
   * datos se sustituye por lo guardado y se perdería lo que se hubiera cambiado mientras.
   */
  readonly bloqueado = computed(
    () => this.ocupado() || this.partidos.isLoading() || this.convocables.isLoading(),
  );
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

  readonly guardandoJornada = signal(false);
  readonly errorJornada = signal<string | null>(null);

  /** Día y hora, sede y pistas: al recargar la jornada se ven en la cabecera y en la imagen. */
  async guardarDatosJornada(datos: DatosConfrontacion): Promise<void> {
    const id = this.id();
    if (!id || this.guardandoJornada()) {
      return;
    }
    this.guardandoJornada.set(true);
    this.errorJornada.set(null);
    try {
      await this.confrontaciones.guardarDatos(id, datos);
      this.confrontacion.reload();
    } catch (error) {
      this.errorJornada.set(error instanceof Error ? error.message : 'No se ha podido guardar.');
    } finally {
      this.guardandoJornada.set(false);
    }
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
