import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import type { MarcadorPartido } from '@data-access/resultados/interfaces/marcador-partido.interface';
import type { PartidoConResultado } from '@data-access/resultados/interfaces/partido-con-resultado.interface';
import { ResultadosService } from '@data-access/resultados/resultados.service';
import type { EstadoGuardado } from '../interfaces/estado-guardado.type';
import { clavePartido } from '@shared/utils/etiquetas-partido';

const INACTIVO: EstadoGuardado = { tipo: 'inactivo' };

/**
 * Datos de la página de resultados de una confrontación (la de la ruta) y el guardado de
 * cada partido. Se provee en la propia página, así que vive y muere con ella.
 */
@Injectable()
export class DatosResultadosService {
  private readonly confrontaciones = inject(ConfrontacionesService);
  private readonly resultadosService = inject(ResultadosService);

  private readonly idConfrontacion = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((parametros) => parametros.get('idConfrontacion'))),
  );

  readonly confrontacion = resource({
    params: () => this.idConfrontacion() ?? undefined,
    loader: ({ params: id }) => this.confrontaciones.obtenerConfrontacion(id),
  });

  readonly resultados = resource({
    params: () => this.idConfrontacion() ?? undefined,
    loader: ({ params: id }) => this.resultadosService.obtenerResultados(id),
  });

  readonly confrontacionActual = computed(() =>
    this.confrontacion.hasValue() ? this.confrontacion.value() : null,
  );

  readonly partidos = computed(() => (this.resultados.hasValue() ? this.resultados.value() : []));

  readonly partidosConResultado = computed(
    () => this.partidos().filter((partido) => partido.marcador.resultado !== null).length,
  );

  private readonly estados = signal<ReadonlyMap<string, EstadoGuardado>>(new Map());

  estadoDe(partido: PartidoConResultado): EstadoGuardado {
    return this.estados().get(clavePartido(partido)) ?? INACTIVO;
  }

  /**
   * Guarda un partido y recarga los datos para que el marcador global y la pareja (que
   * desaparece en un WO en contra) reflejen lo guardado. Los errores quedan en su estado.
   */
  async guardar(partido: PartidoConResultado, marcador: MarcadorPartido): Promise<void> {
    const id = this.idConfrontacion();
    if (!id) {
      return;
    }
    this.cambiarEstado(partido, { tipo: 'guardando' });
    try {
      await this.resultadosService.guardarResultado(id, partido, marcador);
      this.cambiarEstado(partido, { tipo: 'guardado' });
      this.resultados.reload();
      this.confrontacion.reload();
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Ha ocurrido un error inesperado.';
      this.cambiarEstado(partido, { tipo: 'error', mensaje });
    }
  }

  private cambiarEstado(partido: PartidoConResultado, estado: EstadoGuardado): void {
    this.estados.update((estados) => new Map(estados).set(clavePartido(partido), estado));
  }
}
