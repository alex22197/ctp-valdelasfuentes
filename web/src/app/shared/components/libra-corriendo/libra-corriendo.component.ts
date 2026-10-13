import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Easter egg: Libra, la perra de Alex, persigue una pelota de pádel mientras algo carga.
 * Es solo decoración: los lectores de pantalla la saltan y leen el texto de carga.
 */
@Component({
  selector: 'ctp-libra-corriendo',
  templateUrl: './libra-corriendo.component.html',
  styleUrl: './libra-corriendo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { title: 'Libra, a por la bola' },
})
export class LibraCorriendoComponent {}
