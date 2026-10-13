import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import type { BalancePuestoEquipo } from '@data-access/estadisticas/interfaces/balance-puesto-equipo.interface';
import { nombrePista } from '@shared/utils/etiquetas-partido';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import { opcionesPuestos } from '../../utils/opciones-puestos';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';

/** Porcentaje de victorias del equipo en cada puesto, con gráfica y tabla. */
@Component({
  selector: 'ctp-rendimiento-puestos',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './rendimiento-puestos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RendimientoPuestosComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly puestos = input.required<readonly BalancePuestoEquipo[]>();

  protected readonly opciones = computed(() =>
    opcionesPuestos(this.puestos(), this.tema.colores, this.tema.animar),
  );

  protected readonly nombrePista = nombrePista;
}
