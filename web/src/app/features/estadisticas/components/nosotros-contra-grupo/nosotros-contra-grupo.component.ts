import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { EquipoGrupo } from '../../interfaces/equipo-grupo.interface';
import { ALTO_FILA_GRUPO, opcionesGrupo } from '../../utils/opciones-grupo';

/** Partidos a favor y en contra de cada equipo del grupo, con el nuestro resaltado y su tabla. */
@Component({
  selector: 'ctp-nosotros-contra-grupo',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './nosotros-contra-grupo.component.html',
  styleUrl: './nosotros-contra-grupo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NosotrosContraGrupoComponent {
  private readonly tema = inject(TemaGraficasService);

  /** Llegan ordenados de mejor a peor diferencia. */
  readonly equipos = input.required<readonly EquipoGrupo[]>();

  protected readonly opciones = computed(() =>
    opcionesGrupo(this.equipos(), this.tema.colores, this.tema.animar),
  );
  protected readonly alto = computed(() => this.equipos().length * ALTO_FILA_GRUPO + 40);

  protected signo(diferencia: number): string {
    return diferencia > 0 ? `+${diferencia}` : String(diferencia);
  }
}
