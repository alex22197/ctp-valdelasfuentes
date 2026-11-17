import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { Lado } from '@data-access/alineaciones/interfaces/lado.type';
import type { DatosJugador } from '@data-access/jugadores/interfaces/datos-jugador.interface';
import type { JugadorGestion } from '@data-access/jugadores/interfaces/jugador-gestion.interface';
import type { Sexo } from '@data-access/jugadores/interfaces/sexo.type';
import { ACCION_INACTIVA } from '@shared/utils/accion-con-estado';
import type { EstadoAccion } from '@shared/utils/interfaces/estado-accion.type';
import type {
  FormularioJugador,
  InscritoFormulario,
} from '../../interfaces/formulario-jugador.interface';
import { formularioDesdeJugador, leerFormularioJugador } from '../../utils/formulario-jugador';
import { SelectorLadoComponent } from '../selector-lado/selector-lado.component';

/**
 * Formulario de un jugador: nombre corto y completo, sexo, lado, comodín e inscripción. Sin
 * `jugador` es un alta. Guarda y cambia la baja quien lo use; aquí solo se valida lo escrito.
 */
@Component({
  selector: 'ctp-formulario-jugador',
  imports: [SelectorLadoComponent],
  templateUrl: './formulario-jugador.component.html',
  styleUrl: './formulario-jugador.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioJugadorComponent {
  readonly jugador = input<JugadorGestion | null>(null);
  readonly estado = input<EstadoAccion>(ACCION_INACTIVA);
  readonly estadoBaja = input<EstadoAccion>(ACCION_INACTIVA);
  readonly guardar = output<DatosJugador>();
  /** `true` para dar de baja, `false` para reincorporar. */
  readonly cambiarBaja = output<boolean>();

  protected readonly opcionesInscrito: readonly { valor: InscritoFormulario; texto: string }[] = [
    { valor: 'sin-comprobar', texto: 'Sin comprobar' },
    { valor: 'si', texto: 'Sí' },
    { valor: 'no', texto: 'No' },
  ];

  protected readonly formulario = linkedSignal<FormularioJugador>(() =>
    formularioDesdeJugador(this.jugador()),
  );
  /** Por qué no se puede guardar; se borra al tocar cualquier campo. */
  protected readonly aviso = linkedSignal({
    source: this.formulario,
    computation: (): string | null => null,
  });
  /** La baja se confirma en dos pasos; al cambiar de jugador vuelve al primero. */
  protected readonly confirmandoBaja = linkedSignal({
    source: this.jugador,
    computation: () => false,
  });

  protected readonly esNuevo = computed(() => this.jugador() === null);
  protected readonly deBaja = computed(() => this.jugador()?.baja !== null);
  protected readonly enCurso = computed(
    () => this.estado().tipo === 'en-curso' || this.estadoBaja().tipo === 'en-curso',
  );
  protected readonly errorAlGuardar = computed(() => {
    const estado = this.estado();
    const baja = this.estadoBaja();
    return estado.tipo === 'error' ? estado.mensaje : baja.tipo === 'error' ? baja.mensaje : null;
  });

  protected cambiarTexto(campo: 'nombreMostrar' | 'nombreCompleto', evento: Event): void {
    const valor = (evento.target as HTMLInputElement).value;
    this.formulario.update((actual) => ({ ...actual, [campo]: valor }));
  }

  protected elegirSexo(sexo: Sexo): void {
    this.formulario.update((actual) => ({ ...actual, sexo }));
  }

  protected cambiarLado(ladoPreferido: Lado | null): void {
    this.formulario.update((actual) => ({ ...actual, ladoPreferido }));
  }

  protected cambiarComodin(evento: Event): void {
    const comodin = (evento.target as HTMLInputElement).checked;
    this.formulario.update((actual) => ({ ...actual, comodin }));
  }

  protected elegirInscrito(inscrito: InscritoFormulario): void {
    this.formulario.update((actual) => ({ ...actual, inscrito }));
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    const leido = leerFormularioJugador(this.formulario(), this.jugador()?.id ?? null);
    if ('error' in leido) {
      this.aviso.set(leido.error);
      return;
    }
    this.guardar.emit(leido.datos);
  }
}
