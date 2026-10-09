import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import { clavePartido, etiquetaPartido } from '@shared/utils/etiquetas-partido';
import { iniciales } from '@shared/utils/iniciales';
import type { CambioHueco } from '../../interfaces/cambio-hueco.interface';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';
import type { PosicionHueco } from '../../interfaces/posicion-hueco.interface';

interface FichaPista {
  readonly lado: Lado;
  readonly posicion: string;
  readonly idJugador: string | null;
  readonly nombre: string | null;
  readonly iniciales: string;
  readonly etiquetaAccesible: string;
}

/**
 * Una pista de la alineación: revés a la izquierda y drive a la derecha, cada uno con la
 * ficha del jugador (o un hueco con «+»). Al tocar una ficha se pide abrir el panel de
 * jugadores. Con WO en contra la pista no se puede editar, porque no juega nadie.
 */
@Component({
  selector: 'ctp-pista-editable',
  templateUrl: './pista-editable.component.html',
  styleUrl: './pista-editable.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.mixto]': "hueco().tipo === 'mixto'" },
})
export class PistaEditableComponent {
  readonly hueco = input.required<HuecoAlineacion>();
  /** Nombre para mostrar de cada jugador, por id. */
  readonly nombres = input.required<ReadonlyMap<string, string>>();
  /** Errores de normativa de esta pista. */
  readonly errores = input<readonly string[]>([]);
  readonly deshabilitada = input(false);
  /** La ficha que está volando hacia esta pista, para darle su nombre de transición. */
  readonly enVuelo = input<CambioHueco | null>(null);
  readonly abrir = output<PosicionHueco>();

  protected readonly clave = computed(() => clavePartido(this.hueco()));
  protected readonly titulo = computed(() =>
    etiquetaPartido(this.hueco().tipo, this.hueco().numero),
  );
  protected readonly idErrores = computed(() => `errores-${this.clave()}`);

  protected readonly fichas = computed<FichaPista[]>(() => {
    const hueco = this.hueco();
    return [
      this.ficha('reves', 'Revés', hueco.idReves),
      this.ficha('drive', 'Drive', hueco.idDrive),
    ];
  });

  /** Solo la ficha de destino del vuelo lleva el nombre: tiene que ser único en la página. */
  protected nombreTransicion(ficha: FichaPista): string | null {
    const vuelo = this.enVuelo();
    return vuelo &&
      vuelo.clave === this.clave() &&
      vuelo.lado === ficha.lado &&
      vuelo.idJugador !== null &&
      vuelo.idJugador === ficha.idJugador
      ? 'ficha-en-vuelo'
      : null;
  }

  private ficha(lado: Lado, posicion: string, idJugador: string | null): FichaPista {
    const nombre = idJugador ? (this.nombres().get(idJugador) ?? '?') : null;
    const donde = `${posicion} de ${this.titulo()}`;
    return {
      lado,
      posicion,
      idJugador,
      nombre,
      iniciales: nombre ? iniciales(nombre) : '+',
      etiquetaAccesible: nombre ? `${donde}: ${nombre}. Cambiar` : `${donde}: sin asignar. Elegir`,
    };
  }
}
