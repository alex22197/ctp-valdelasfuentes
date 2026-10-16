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
import type { FormularioJornada } from './interfaces/formulario-jornada.interface';
import { formularioDesdeJornada, leerFormularioJornada } from './utils/formulario-jornada';

/**
 * Botón para que un gestor ponga el día y la hora, la sede y las pistas de una jornada, con el
 * formulario desplegable. Guarda la página (`guardar`); al llegar la jornada actualizada, el
 * formulario se cierra solo.
 */
@Component({
  selector: 'ctp-datos-jornada',
  templateUrl: './datos-jornada.component.html',
  styleUrl: './datos-jornada.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatosJornadaComponent {
  readonly jornada = input.required<ConfrontacionNuestroEquipo>();
  readonly guardando = input(false);
  /** Error al guardar, en castellano, o `null`. */
  readonly error = input<string | null>(null);
  readonly guardar = output<DatosConfrontacion>();

  protected readonly pistas = [1, 2, 3, 4, 5, 6];
  /** Se cierra cuando llega la jornada guardada. */
  protected readonly abierto = linkedSignal({ source: this.jornada, computation: () => false });
  protected readonly formulario = linkedSignal<FormularioJornada>(() =>
    formularioDesdeJornada(this.jornada()),
  );
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
    this.formulario.set(formularioDesdeJornada(this.jornada()));
    this.abierto.set(false);
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
