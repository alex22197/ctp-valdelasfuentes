import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { DatosConfrontacion } from '@data-access/confrontaciones/interfaces/datos-confrontacion.interface';
import { ACCION_INACTIVA } from '@shared/utils/accion-con-estado';
import type { EstadoAccion } from '@shared/utils/interfaces/estado-accion.type';
import type { FormularioJornada } from './interfaces/formulario-jornada.interface';
import { formularioDesdeJornada, leerFormularioJornada } from './utils/formulario-jornada';

/**
 * Botón para que un gestor ponga el día y la hora, la sede y las pistas de una jornada, con el
 * formulario desplegable. Guarda la página (`guardar`) y le cuenta cómo va con `estado`: el
 * formulario se cierra al quedar hecha y se queda abierto, con el mensaje, si falla.
 */
@Component({
  selector: 'ctp-datos-jornada',
  templateUrl: './datos-jornada.component.html',
  styleUrl: './datos-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatosJornadaComponent {
  readonly jornada = input.required<ConfrontacionNuestroEquipo>();
  readonly estado = input<EstadoAccion>(ACCION_INACTIVA);
  readonly guardar = output<DatosConfrontacion>();

  protected readonly pistas = [1, 2, 3, 4, 5, 6];
  protected readonly enCurso = computed(() => this.estado().tipo === 'en-curso');
  protected readonly errorAlGuardar = computed(() => {
    const estado = this.estado();
    return estado.tipo === 'error' ? estado.mensaje : null;
  });

  /** Se cierra cuando la acción queda hecha; con un error sigue abierto para corregir. */
  protected readonly abierto = linkedSignal<EstadoAccion, boolean>({
    source: this.estado,
    computation: (estado, anterior) =>
      estado.tipo === 'hecho' ? false : (anterior?.value ?? false),
  });

  /**
   * Lo escrito. Parte de los datos de la jornada y vuelve a ellos al cerrarse; mientras está
   * abierto, que la jornada cambie por otra causa (publicar la convocatoria) no borra nada.
   */
  protected readonly formulario = linkedSignal<ConfrontacionNuestroEquipo, FormularioJornada>({
    source: this.jornada,
    computation: (jornada, anterior) =>
      anterior && this.abierto() ? anterior.value : formularioDesdeJornada(jornada),
  });

  /** Por qué no se puede guardar; se borra al tocar cualquier campo. */
  protected readonly aviso = linkedSignal({
    source: this.formulario,
    computation: (): string | null => null,
  });

  protected readonly textoBoton = computed(() =>
    this.jornada().fechaHora ? 'Cambiar fecha, hora y sede' : 'Poner fecha, hora y sede',
  );

  protected cambiar(campo: keyof FormularioJornada, evento: Event): void {
    const valor = (evento.target as HTMLInputElement | HTMLSelectElement).value;
    this.formulario.update((actual) => ({ ...actual, [campo]: valor }));
  }

  protected cancelar(): void {
    this.abierto.set(false);
    this.formulario.set(formularioDesdeJornada(this.jornada()));
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    const leido = leerFormularioJornada(this.formulario());
    if ('error' in leido) {
      this.aviso.set(leido.error);
      return;
    }
    this.guardar.emit(leido.datos);
  }
}
