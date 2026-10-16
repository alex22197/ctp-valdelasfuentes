import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * La convocatoria aún sin publicar: seis pistas pequeñas y vacías, solo con sus líneas, y el
 * aviso de cuándo aparecerá. Es un estado vacío, no un hueco de carga: la alineación saldrá
 * en su lugar cuando el capitán la publique.
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
