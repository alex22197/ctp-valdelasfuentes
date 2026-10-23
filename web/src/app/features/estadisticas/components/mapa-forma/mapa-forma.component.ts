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
import type { JornadaJugada } from '@data-access/estadisticas/interfaces/jornada-jugada.interface';
import type { JugadorPareja } from '@data-access/estadisticas/interfaces/jugador-pareja.interface';
import type { PartidoJugadorEquipo } from '@data-access/estadisticas/interfaces/partido-jugador-equipo.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { GraficaEstadisticaComponent } from '@shared/components/grafica-estadistica/grafica-estadistica.component';
import type { ToqueGrafica } from '@shared/components/grafica-estadistica/interfaces/toque-grafica.interface';
import { TemaGraficasService } from '@shared/services/tema-graficas.service';
import type { CeldaForma } from '../../interfaces/celda-forma.interface';
import type { EstadoForma } from '../../interfaces/estado-forma.type';
import type { JugadorResaltado } from '../../interfaces/jugador-resaltado.interface';
import type { OpcionPildora } from '../../interfaces/opcion-pildora.interface';
import { jugadorDeLista } from '../../utils/jugador-tocado';
import { construirMapaForma } from '../../utils/mapa-forma';
import {
  ALTO_FILA_FORMA,
  ANCHO_COLUMNA_FORMA,
  datosMapaForma,
  opcionesMapaForma,
} from '../../utils/opciones-mapa-forma';
import { SelectorPildorasComponent } from '../selector-pildoras/selector-pildoras.component';

const SEXOS: readonly OpcionPildora<Sexo>[] = [
  { valor: 'masculino', etiqueta: 'Chicos' },
  { valor: 'femenino', etiqueta: 'Chicas' },
];

/** Espacio para los nombres y las etiquetas de los ejes, en píxeles. */
const MARGEN_EJES = 110;

/**
 * Mapa de forma: cada jugador en una fila y cada jornada en una columna, con ✓ si ganó, ✕ si
 * perdió, WO si ganó sin jugar y nada si no jugó. Tocar una casilla o un nombre resalta a ese
 * jugador.
 */
@Component({
  selector: 'ctp-mapa-forma',
  imports: [RouterLink, GraficaEstadisticaComponent, SelectorPildorasComponent],
  templateUrl: './mapa-forma.component.html',
  styleUrl: './mapa-forma.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapaFormaComponent {
  private readonly tema = inject(TemaGraficasService);

  readonly jornadas = input.required<readonly JornadaJugada[]>();
  readonly partidos = input.required<readonly PartidoJugadorEquipo[]>();
  readonly sexos = input.required<ReadonlyMap<string, Sexo>>();
  readonly idResaltado = input<string | null>(null);
  readonly enlazarComodines = input(false);
  readonly resaltar = output<JugadorResaltado>();

  protected readonly opcionesSexo = SEXOS;
  protected readonly sexo = signal<Sexo>('masculino');

  protected readonly mapa = computed(() =>
    construirMapaForma(this.jornadas(), this.partidos(), this.sexos(), this.sexo()),
  );

  protected readonly opciones = computed(() =>
    opcionesMapaForma(this.mapa(), this.tema.colores, this.tema.animar),
  );

  protected readonly cambios = computed(() => ({
    series: [{ data: datosMapaForma(this.mapa(), this.tema.colores, this.idResaltado()) }],
  }));

  /** Alto y ancho mínimos para que cada casilla se pueda tocar; si no cabe, se desplaza. */
  protected readonly alto = computed(() => this.mapa().jugadores.length * ALTO_FILA_FORMA + 40);
  protected readonly ancho = computed(
    () => this.mapa().jornadas.length * ANCHO_COLUMNA_FORMA + MARGEN_EJES,
  );

  protected readonly simbolo: Record<EstadoForma, string> = {
    ganado: '✓',
    perdido: '✕',
    wo: 'WO',
    'no-jugo': '–',
  };

  protected readonly hayComodines = computed(() => this.mapa().jugadores.some((j) => j.comodin));

  protected celdasDe(fila: number): CeldaForma[] {
    return this.mapa().celdas.filter((c) => c.fila === fila);
  }

  protected enlazable(jugador: JugadorPareja): boolean {
    return !jugador.comodin || this.enlazarComodines();
  }

  protected alTocar(toque: ToqueGrafica): void {
    const mapa = this.mapa();
    const jugador =
      toque.indice !== null
        ? (mapa.jugadores[mapa.celdas[toque.indice]?.fila ?? -1] ?? null)
        : jugadorDeLista(mapa.jugadores, toque);
    if (jugador) {
      this.resaltar.emit(jugador);
    }
  }
}
