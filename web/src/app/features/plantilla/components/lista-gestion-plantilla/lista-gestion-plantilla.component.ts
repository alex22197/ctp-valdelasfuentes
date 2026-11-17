import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import { iniciales } from '@shared/utils/iniciales';
import type { GruposGestionPlantilla } from '../../interfaces/grupos-gestion-plantilla.interface';

/** La plantilla como una lista de filas táctiles por grupo; tocar una abre su edición. */
@Component({
  selector: 'ctp-lista-gestion-plantilla',
  imports: [NgTemplateOutlet],
  templateUrl: './lista-gestion-plantilla.component.html',
  styleUrl: './lista-gestion-plantilla.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaGestionPlantillaComponent {
  readonly grupos = input.required<GruposGestionPlantilla>();
  readonly editar = output<JugadorGestion>();

  protected readonly iniciales = iniciales;

  protected readonly secciones = computed(() =>
    [
      { titulo: 'Chicos', jugadores: this.grupos().chicos },
      { titulo: 'Chicas', jugadores: this.grupos().chicas },
      { titulo: 'Comodines', jugadores: this.grupos().comodines },
    ].filter((seccion) => seccion.jugadores.length > 0),
  );

  protected lado(jugador: JugadorGestion): string | null {
    return jugador.ladoPreferido === 'reves'
      ? 'Revés'
      : jugador.ladoPreferido === 'drive'
        ? 'Drive'
        : null;
  }
}
