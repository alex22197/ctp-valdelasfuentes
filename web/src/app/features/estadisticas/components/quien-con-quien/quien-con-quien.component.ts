import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import type { TipoPartido } from '@data-access/alineaciones/interfaces/tipo-partido.type';
import type { BalancePareja } from '@data-access/estadisticas/interfaces/balance-pareja.interface';
import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { JugadorResaltado } from '../../interfaces/jugador-resaltado.interface';
import type { OpcionPildora } from '../../interfaces/opcion-pildora.interface';
import { jugadorDeMatriz } from '../../utils/jugador-tocado';
import { construirMatriz } from '../../utils/matriz-parejas';
import { ALTO_FILA_MATRIZ, datosMatriz, opcionesMatriz } from '../../utils/opciones-matriz';
import { SelectorPildorasComponent } from '../selector-pildoras/selector-pildoras.component';

const TIPOS: readonly OpcionPildora<TipoPartido>[] = [
  { valor: 'masculino', etiqueta: 'Chicos' },
  { valor: 'femenino', etiqueta: 'Chicas' },
  { valor: 'mixto', etiqueta: 'Mixto' },
];

/** Espacio para los nombres de los ejes, en píxeles. */
const MARGEN_EJES = 110;

/**
 * Matriz de parejas por tipo de partido, con su tabla de datos. Tocar una casilla resalta al
 * jugador de su fila; tocar un nombre, a ese jugador.
 */
@Component({
  selector: 'ctp-quien-con-quien',
  imports: [RouterLink, GraficaEstadisticaComponent, SelectorPildorasComponent],
  templateUrl: './quien-con-quien.component.html',
  styleUrl: './quien-con-quien.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuienConQuienComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly parejas = input.required<readonly BalancePareja[]>();
  readonly sexos = input.required<ReadonlyMap<string, Sexo>>();
  readonly idResaltado = input<string | null>(null);
  readonly enlazarComodines = input(false);
  readonly resaltar = output<JugadorResaltado>();

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

  protected readonly cambios = computed(() => ({
    series: [{ data: datosMatriz(this.matriz(), this.tema.colores, this.idResaltado()) }],
  }));

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

  protected enlazable(jugador: JugadorPareja): boolean {
    return !jugador.comodin || this.enlazarComodines();
  }

  protected alTocar(toque: ToqueGrafica): void {
    const jugador = jugadorDeMatriz(this.matriz(), toque);
    if (jugador) {
      this.resaltar.emit(jugador);
    }
  }
}
