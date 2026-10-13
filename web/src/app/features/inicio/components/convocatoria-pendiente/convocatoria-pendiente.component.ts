import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * La convocatoria aún sin publicar: las seis pistas vacías, solo con sus líneas, y el aviso
 * de cuándo aparecerá. Ocupa el mismo sitio que la alineación, así que nada salta al llegar.
 */
@Component({
  selector: 'ctp-convocatoria-pendiente',
  templateUrl: './convocatoria-pendiente.component.html',
  styleUrl: './convocatoria-pendiente.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvocatoriaPendienteComponent {
  protected readonly pistas = [1, 2, 3, 4, 5, 6];
}
