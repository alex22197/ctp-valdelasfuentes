import { Injectable, computed, inject, resource, signal } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import type { DatosJugador } from '@data-access/jugadores/interfaces/datos-jugador.interface';
import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { AccionConEstado } from '@shared/utils/accion-con-estado';
import { agruparGestionPlantilla } from '../utils/agrupar-gestion-plantilla';

/**
 * Datos de la gestión de la plantilla: la competición activa, su plantilla entera (bajas
 * incluidas) y a quién se está editando. Se provee en la propia página.
 */
@Injectable()
export class DatosGestionPlantillaService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly jugadores = inject(JugadoresService);

  readonly competicion = resource({
    loader: () => this.competiciones.obtenerCompeticionActiva(),
  });

  private readonly idCompeticion = computed(() =>
    this.competicion.hasValue() ? (this.competicion.value()?.id ?? null) : null,
  );

  readonly plantilla = resource({
    params: () => this.idCompeticion() ?? undefined,
    loader: ({ params: id }) => this.jugadores.obtenerPlantillaGestion(id),
  });

  readonly grupos = computed(() =>
    agruparGestionPlantilla(this.plantilla.hasValue() ? this.plantilla.value() : []),
  );

  readonly vacia = computed(() => this.plantilla.hasValue() && this.plantilla.value().length === 0);

  readonly estado = computed((): 'cargando' | 'error' | 'sin-competicion' | 'lista' => {
    if (this.competicion.error() || this.plantilla.error()) {
      return 'error';
    }
    if (!this.competicion.hasValue()) {
      return 'cargando';
    }
    if (!this.idCompeticion()) {
      return 'sin-competicion';
    }
    // Solo la primera carga es esqueleto: al recargar tras guardar, la lista se queda.
    return this.plantilla.hasValue() ? 'lista' : 'cargando';
  });

  /** A quién se edita en la hoja: uno nuevo, un jugador o nadie (hoja cerrada). */
  readonly editando = signal<JugadorGestion | 'nuevo' | null>(null);
  readonly guardado = new AccionConEstado('No se ha podido guardar el jugador.');
  readonly cambioDeBaja = new AccionConEstado('No se ha podido cambiar la baja.');

  abrir(quien: JugadorGestion | 'nuevo'): void {
    this.guardado.reiniciar();
    this.cambioDeBaja.reiniciar();
    this.editando.set(quien);
  }

  cerrar(): void {
    this.editando.set(null);
  }

  /** Guarda y, si va bien, cierra la hoja; la lista se recarga con el cambio. */
  async guardar(datos: DatosJugador): Promise<void> {
    const id = this.idCompeticion();
    if (!id) {
      return;
    }
    const ok = await this.guardado.ejecutar(async () => {
      await this.jugadores.guardarJugador(id, datos);
      this.plantilla.reload();
    });
    if (ok) {
      this.cerrar();
    }
  }

  async cambiarBaja(jugador: JugadorGestion, baja: boolean): Promise<void> {
    const id = this.idCompeticion();
    if (!id) {
      return;
    }
    const ok = await this.cambioDeBaja.ejecutar(async () => {
      await this.jugadores.cambiarBaja(id, jugador.id, baja);
      this.plantilla.reload();
    });
    if (ok) {
      this.cerrar();
    }
  }
}
