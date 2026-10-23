import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { EnfrentamientoGrupo } from '@data-access/confrontaciones/interfaces/enfrentamiento-grupo.interface';
import type { JornadaGrupo } from '../../interfaces/jornada-grupo.interface';
import { esNuestro } from '../../utils/jornadas-grupo';

/**
 * Los resultados de todo el grupo, jornada a jornada: local, marcador y visitante. El ganador
 * en negrita y el nuestro resaltado, como en la tabla.
 */
@Component({
  selector: 'ctp-jornadas-grupo',
  templateUrl: './jornadas-grupo.component.html',
  styleUrl: './jornadas-grupo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JornadasGrupoComponent {
  readonly jornadas = input.required<readonly JornadaGrupo[]>();

  protected readonly esNuestro = esNuestro;

  protected gana(enfrentamiento: EnfrentamientoGrupo, lado: 'local' | 'visitante'): boolean {
    const marcador = enfrentamiento.marcador;
    if (!marcador) {
      return false;
    }
    return lado === 'local'
      ? marcador.local > marcador.visitante
      : marcador.visitante > marcador.local;
  }
}
