import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { TemaGraficasService } from '../../services/tema-graficas.service';
import { construirMatriz } from '../../utils/matriz-parejas';
import { ALTO_FILA_MATRIZ, opcionesMatriz } from '../../utils/opciones-matriz';
import { GraficaEstadisticaComponent } from '../grafica-estadistica/grafica-estadistica.component';

const TIPOS: readonly { tipo: TipoPartido; nombre: string }[] = [
  { tipo: 'masculino', nombre: 'Chicos' },
  { tipo: 'femenino', nombre: 'Chicas' },
  { tipo: 'mixto', nombre: 'Mixto' },
];

/** Espacio para los nombres de los ejes, en píxeles. */
const MARGEN_EJES = 110;

/** Matriz de parejas por tipo de partido, con su tabla de datos. */
@Component({
  selector: 'ctp-quien-con-quien',
  imports: [GraficaEstadisticaComponent],
  templateUrl: './quien-con-quien.component.html',
  styleUrl: './quien-con-quien.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuienConQuienComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly parejas = input.required<readonly BalancePareja[]>();
  readonly sexos = input.required<ReadonlyMap<string, Sexo>>();

  protected readonly tipos = TIPOS;
  protected readonly tipo = signal<TipoPartido>('masculino');

  protected readonly matriz = computed(() =>
    construirMatriz(this.parejas(), this.tipo(), this.sexos()),
  );

  protected readonly parejasDelTipo = computed(() =>
    this.parejas().filter((p) => p.tipo === this.tipo()),
  );

  protected readonly opciones = computed(() =>
    opcionesMatriz(this.matriz(), this.tema.colores, this.tema.animar),
  );

  /** Alto y ancho mínimos para que cada casilla se pueda tocar; si no cabe, se desplaza. */
  protected readonly alto = computed(
    () => this.matriz().filas.length * ALTO_FILA_MATRIZ + MARGEN_EJES,
  );
  protected readonly ancho = computed(
    () => this.matriz().columnas.length * ALTO_FILA_MATRIZ + MARGEN_EJES,
  );

  protected readonly hayComodines = computed(() =>
    [...this.matriz().filas, ...this.matriz().columnas].some((j) => j.comodin),
  );
}
