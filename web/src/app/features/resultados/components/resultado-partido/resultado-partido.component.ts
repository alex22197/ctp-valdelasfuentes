import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import type { ErrorMarcador } from '@data-access/resultados/interfaces/error-marcador.interface';
import type { MarcadorPartido } from '@data-access/resultados/interfaces/marcador-partido.interface';
import type { PartidoConResultado } from '@data-access/resultados/interfaces/partido-con-resultado.interface';
import { validarMarcador } from '@data-access/resultados/validar-marcador';
import { etiquetaPartido } from '@shared/utils/etiquetas-partido';
import type { EstadoGuardado } from '../../interfaces/estado-guardado.type';
import type { SetFormulario } from '../../interfaces/set-formulario.interface';
import {
  OPCIONES_RESULTADO,
  clavePartido,
  construirMarcador,
  describirPareja,
  marcadoresIguales,
  resultadoLlevaSets,
  setsFormularioDesde,
} from '../../utils/formulario-resultado';
import { CampoSetComponent } from '../campo-set/campo-set.component';

/**
 * Formulario del resultado de un partido: cómo terminó, los sets y, en un abandono, quién
 * ganó. Valida el marcador antes de emitirlo; quien lo usa decide cómo guardarlo y le
 * devuelve el estado del guardado.
 */
@Component({
  selector: 'ctp-resultado-partido',
  imports: [CampoSetComponent],
  templateUrl: './resultado-partido.component.html',
  styleUrl: './resultado-partido.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadoPartidoComponent {
  readonly partido = input.required<PartidoConResultado>();
  readonly estado = input<EstadoGuardado>({ tipo: 'inactivo' });
  readonly guardar = output<MarcadorPartido>();

  protected readonly opciones = OPCIONES_RESULTADO;

  /** Solo cambia si cambia lo guardado, para no borrar lo que se está escribiendo. */
  private readonly marcadorGuardado = computed(() => this.partido().marcador, {
    equal: marcadoresIguales,
  });

  protected readonly resultado = linkedSignal(() => this.marcadorGuardado().resultado);
  protected readonly ganado = linkedSignal(() => this.marcadorGuardado().ganado);
  protected readonly sets = linkedSignal(() => setsFormularioDesde(this.marcadorGuardado().sets));
  protected readonly errorValidacion = linkedSignal<MarcadorPartido, ErrorMarcador | null>({
    source: this.marcadorGuardado,
    computation: () => null,
  });

  protected readonly titulo = computed(() =>
    etiquetaPartido(this.partido().tipo, this.partido().numero),
  );
  protected readonly pareja = computed(() =>
    describirPareja(this.partido().reves, this.partido().drive),
  );
  protected readonly tienePareja = computed(
    () => this.partido().reves !== null || this.partido().drive !== null,
  );
  protected readonly nombreGrupo = computed(() => `resultado-${clavePartido(this.partido())}`);
  protected readonly mensajeError = computed(() => {
    const estado = this.estado();
    return estado.tipo === 'error' ? estado.mensaje : null;
  });
  protected readonly llevaSets = computed(() => resultadoLlevaSets(this.resultado()));
  protected readonly hayCambios = computed(
    () =>
      !marcadoresIguales(
        construirMarcador(this.resultado(), this.ganado(), this.sets()),
        this.marcadorGuardado(),
      ),
  );

  protected cambiarSet(indice: number, valor: SetFormulario): void {
    this.sets.update((sets) => sets.map((set, i) => (i === indice ? valor : set)));
  }

  protected errorDeSet(numeroSet: number): string | null {
    const error = this.errorValidacion();
    return error?.numeroSet === numeroSet ? error.mensaje : null;
  }

  protected enviar(evento: Event): void {
    evento.preventDefault();
    const marcador = construirMarcador(this.resultado(), this.ganado(), this.sets());
    const error = validarMarcador(marcador);
    this.errorValidacion.set(error);
    if (!error) {
      this.guardar.emit(marcador);
    }
  }
}
