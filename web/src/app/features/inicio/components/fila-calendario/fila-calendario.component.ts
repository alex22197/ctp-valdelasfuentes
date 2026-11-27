import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { etiquetaEstadoJornada } from '@data-access/confrontaciones/estado-jornada';
import type { ConfrontacionNuestroEquipo } from '@data-access/confrontaciones/interfaces/confrontacion-nuestro-equipo.interface';
import type { ResultadoConfrontacion } from '@data-access/confrontaciones/interfaces/resultado-confrontacion.type';
import { resultadoDe } from '@data-access/confrontaciones/resultado-confrontacion';
import { describirFechaBreve } from '@shared/utils/fechas';
import { accionesGestionJornada } from '../../utils/acciones-gestion-jornada';

const NOMBRE_RESULTADO: Record<ResultadoConfrontacion, string> = {
  victoria: 'Victoria',
  empate: 'Empate',
  derrota: 'Derrota',
};

/**
 * Una jornada en el calendario de la portada: a la izquierda su número, en medio el rival con
 * la fecha y si es en casa o fuera, y a la derecha lo que importa de ella: el resultado en una
 * ficha de color, o que es la próxima o está aplazada.
 */
@Component({
  selector: 'ctp-fila-calendario',
  imports: [RouterLink],
  templateUrl: './fila-calendario.component.html',
  styleUrl: './fila-calendario.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilaCalendarioComponent {
  readonly jornada = input.required<ConfrontacionNuestroEquipo>();
  /** Lo que va en lugar de «J3» si no tiene número: «Reto», «Play-off»… */
  readonly sinNumero = input('–');
  /** Es el próximo partido del equipo: se destaca. */
  readonly proxima = input(false);
  /** Ya se disputó (o pasó su día): si no tiene marcador, se dice que falta. */
  readonly disputada = input(false);
  /** Muestra los enlaces de gestión que toquen. */
  readonly enlacesGestion = input(false);
  /** Hoy en Madrid (AAAA-MM-DD), para saber qué enlaces de gestión tocan. */
  readonly hoy = input.required<string>();

  protected readonly fecha = computed(() =>
    describirFechaBreve(this.jornada().fechaHora, this.jornada().fechaPrevista),
  );

  protected readonly etiquetaEstado = computed(() => etiquetaEstadoJornada(this.jornada().estado));

  /** El resultado con su nombre, para pintar la ficha y decirlo a los lectores de pantalla. */
  protected readonly resultado = computed(() => {
    const marcador = this.jornada().marcador;
    if (!marcador) {
      return null;
    }
    const tipo = resultadoDe(marcador);
    return { tipo, nombre: NOMBRE_RESULTADO[tipo], marcador };
  });

  protected readonly acciones = computed(() =>
    this.enlacesGestion() ? accionesGestionJornada(this.jornada(), this.hoy()) : [],
  );
}
