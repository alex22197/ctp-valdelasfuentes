import { Injectable, computed, inject, linkedSignal, resource, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { DisponibilidadService } from '@data-access/disponibilidad/disponibilidad.service';
import type { JugadorEncuesta } from '@data-access/disponibilidad/interfaces/jugador-encuesta.interface';
import type { RespuestaEncuesta } from '@data-access/disponibilidad/interfaces/respuesta-encuesta.type';
import { agruparPorSexo, contarRespuestas } from '../utils/lista-encuesta';

/**
 * Datos de «pasar lista» para la confrontación de la ruta. Cada toque se refleja al
 * instante y se guarda en segundo plano; si falla, se deshace y se muestra el error en
 * la fila del jugador. Se provee en la propia página, así que vive y muere con ella.
 */
@Injectable()
export class DatosPasarListaService {
  private readonly confrontaciones = inject(ConfrontacionesService);
  private readonly disponibilidad = inject(DisponibilidadService);

  private readonly idConfrontacion = toSignal(
    inject(ActivatedRoute).paramMap.pipe(map((parametros) => parametros.get('idConfrontacion'))),
  );

  readonly confrontacion = resource({
    params: () => this.idConfrontacion() ?? undefined,
    loader: ({ params: id }) => this.confrontaciones.obtenerConfrontacion(id),
  });

  readonly lista = resource({
    params: () => this.idConfrontacion() ?? undefined,
    loader: ({ params: id }) => this.disponibilidad.obtenerListaEncuesta(id),
  });

  readonly confrontacionActual = computed(() =>
    this.confrontacion.hasValue() ? this.confrontacion.value() : null,
  );

  /** Lista cargada más los cambios hechos en esta página. */
  private readonly jugadores = linkedSignal<readonly JugadorEncuesta[]>(() =>
    this.lista.hasValue() ? this.lista.value() : [],
  );

  readonly grupos = computed(() => agruparPorSexo(this.jugadores()));
  readonly recuento = computed(() => contarRespuestas(this.jugadores()));

  /** Jugadores cuya respuesta se está guardando: sus botones se bloquean mientras tanto. */
  readonly guardando = signal<ReadonlySet<string>>(new Set());
  /** Último error al guardar, por jugador. */
  readonly errores = signal<ReadonlyMap<string, string>>(new Map());

  async responder(jugador: JugadorEncuesta, respuesta: RespuestaEncuesta | null): Promise<void> {
    const id = this.idConfrontacion();
    const anterior = this.jugadores().find((j) => j.id === jugador.id)?.respuesta ?? null;
    if (!id || this.guardando().has(jugador.id) || anterior === respuesta) {
      return;
    }

    this.cambiarRespuesta(jugador.id, respuesta);
    this.guardando.update((ids) => new Set(ids).add(jugador.id));
    this.errores.update((errores) => sinClave(errores, jugador.id));
    try {
      await this.disponibilidad.guardarRespuesta(id, jugador.id, respuesta);
    } catch (error) {
      this.cambiarRespuesta(jugador.id, anterior);
      const mensaje = error instanceof Error ? error.message : 'No se ha podido guardar.';
      this.errores.update((errores) => new Map(errores).set(jugador.id, mensaje));
    } finally {
      this.guardando.update((ids) => {
        const siguientes = new Set(ids);
        siguientes.delete(jugador.id);
        return siguientes;
      });
    }
  }

  private cambiarRespuesta(idJugador: string, respuesta: RespuestaEncuesta | null): void {
    this.jugadores.update((jugadores) =>
      jugadores.map((j) => (j.id === idJugador ? { ...j, respuesta } : j)),
    );
  }
}

function sinClave<T>(mapa: ReadonlyMap<string, T>, clave: string): ReadonlyMap<string, T> {
  const copia = new Map(mapa);
  copia.delete(clave);
  return copia;
}
