import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import { clavePartido, etiquetaPartido } from '@shared/utils/etiquetas-partido';
import type { CambioHueco } from '../../interfaces/cambio-hueco.interface';
import type { GrupoOpciones } from '../../interfaces/grupo-opciones.interface';
import type { HuecoAlineacion } from '../../interfaces/hueco-alineacion.interface';

/**
 * Una pista de la alineación con un desplegable para el revés (izquierda) y otro para el
 * drive (derecha). Con WO en contra no se puede editar, porque no juega nadie.
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
  readonly opciones = input.required<readonly GrupoOpciones[]>();
  /** Errores de normativa de esta pista. */
  readonly errores = input<readonly string[]>([]);
  readonly deshabilitada = input(false);
  readonly cambiar = output<CambioHueco>();

  protected readonly clave = computed(() => clavePartido(this.hueco()));
  protected readonly titulo = computed(() =>
    etiquetaPartido(this.hueco().tipo, this.hueco().numero),
  );
  protected readonly idErrores = computed(() => `errores-${this.clave()}`);

  protected elegir(lado: Lado, evento: Event): void {
    const valor = (evento.target as HTMLSelectElement).value;
    this.cambiar.emit({ clave: this.clave(), lado, idJugador: valor === '' ? null : valor });
  }
}
