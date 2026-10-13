import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PeticionesEnCursoService } from '@core/supabase/peticiones-en-curso.service';
import { LibraCorriendoComponent } from '@shared/components/libra-corriendo/libra-corriendo.component';

/**
 * Mientras se espera una respuesta que tarda, Libra persigue la pelota en una ventana
 * centrada delante del contenido. Es solo visual: cada sección ya anuncia su «Cargando…» a
 * los lectores de pantalla.
 */
@Component({
  selector: 'ctp-espera-libra',
  imports: [LibraCorriendoComponent],
  templateUrl: './espera-libra.component.html',
  styleUrl: './espera-libra.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EsperaLibraComponent {
  protected readonly peticiones = inject(PeticionesEnCursoService);
}
