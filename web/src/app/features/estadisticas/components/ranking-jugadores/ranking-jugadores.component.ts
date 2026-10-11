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
import type { EstadisticaJugador } from '@data-access/estadisticas/interfaces/estadistica-jugador.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { JugadorResaltado } from '../../interfaces/jugador-resaltado.interface';
import type { OpcionPildora } from '../../interfaces/opcion-pildora.interface';
import type { OrdenRanking } from '../../interfaces/orden-ranking.type';
import { jugadorDeLista } from '../../utils/jugador-tocado';
import {
  ALTO_FILA_RANKING,
  datosRanking,
  diferenciaJuegos,
  opcionesRanking,
  ordenarRanking,
} from '../../utils/ranking-jugadores';
import { SelectorPildorasComponent } from '../selector-pildoras/selector-pildoras.component';

const SEXOS: readonly OpcionPildora<Sexo>[] = [
  { valor: 'masculino', etiqueta: 'Chicos' },
  { valor: 'femenino', etiqueta: 'Chicas' },
];

const ORDENES: readonly OpcionPildora<OrdenRanking>[] = [
  { valor: 'partidos', etiqueta: 'Partidos' },
  { valor: 'victorias', etiqueta: '% victorias' },
  { valor: 'juegos', etiqueta: 'Juegos' },
];

/** Ranking de jugadores ordenable; tocar una barra o un nombre resalta a ese jugador. */
@Component({
  selector: 'ctp-ranking-jugadores',
  imports: [RouterLink, GraficaEstadisticaComponent, SelectorPildorasComponent],
  templateUrl: './ranking-jugadores.component.html',
  styleUrl: './ranking-jugadores.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingJugadoresComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly jugadores = input.required<readonly EstadisticaJugador[]>();
  readonly sexos = input.required<ReadonlyMap<string, Sexo>>();
  readonly idResaltado = input<string | null>(null);
  readonly enlazarComodines = input(false);
  readonly resaltar = output<JugadorResaltado>();

  protected readonly opcionesSexo = SEXOS;
  protected readonly opcionesOrden = ORDENES;
  protected readonly sexo = signal<Sexo>('masculino');
  protected readonly orden = signal<OrdenRanking>('partidos');

  protected readonly lista = computed(() =>
    ordenarRanking(this.jugadores(), this.sexos(), this.sexo(), this.orden()),
  );

  protected readonly opciones = computed(() =>
    opcionesRanking(this.lista(), this.orden(), this.tema.colores, this.tema.animar),
  );

  /** El resaltado se aplica encima, sin redibujar; depende también de la lista. */
  protected readonly cambios = computed(() => ({
    series: [
      { data: datosRanking(this.lista(), this.orden(), this.tema.colores, this.idResaltado()) },
    ],
  }));

  protected readonly alto = computed(() => this.lista().length * ALTO_FILA_RANKING + 24);

  protected readonly diferenciaJuegos = diferenciaJuegos;

  protected alTocar(toque: ToqueGrafica): void {
    const jugador = jugadorDeLista(this.lista(), toque);
    if (jugador) {
      this.resaltar.emit(jugador);
    }
  }
}
