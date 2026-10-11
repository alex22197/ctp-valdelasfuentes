import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { ParticipacionJugador } from '@data-access/estadisticas/interfaces/participacion-jugador.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import { ALTO_FILA_PARTICIPACION, opcionesParticipacion } from '../../utils/opciones-participacion';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';

/** Espacio para la leyenda y el eje, en píxeles. */
const MARGEN = 90;

/** Respuestas y participación de cada jugador, con gráfica y tabla. Solo para gestores. */
@Component({
  selector: 'ctp-participacion-equipo',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './participacion-equipo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipacionEquipoComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly participacion = input.required<readonly ParticipacionJugador[]>();

  protected readonly opciones = computed(() =>
    opcionesParticipacion(this.participacion(), this.tema.colores, this.tema.animar),
  );

  protected readonly alto = computed(
    () => this.participacion().length * ALTO_FILA_PARTICIPACION + MARGEN,
  );
}
