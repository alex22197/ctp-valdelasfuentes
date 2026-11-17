import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { HojaComponent } from '@shared/components/hoja/hoja.component';
import { MensajeEstadoComponent } from '@shared/components/mensaje-estado/mensaje-estado.component';
import { FormularioJugadorComponent } from '../../components/formulario-jugador/formulario-jugador.component';
import { ListaGestionPlantillaComponent } from '../../components/lista-gestion-plantilla/lista-gestion-plantilla.component';
import { DatosGestionPlantillaService } from '../../services/datos-gestion-plantilla.service';

/**
 * La plantilla para los gestores: dar de alta, editar y dar de baja jugadores. La lista es la
 * página; la edición va en una hoja que sube desde abajo.
 */
@Component({
  selector: 'ctp-gestion-plantilla-page',
  imports: [
    HojaComponent,
    MensajeEstadoComponent,
    FormularioJugadorComponent,
    ListaGestionPlantillaComponent,
  ],
  providers: [DatosGestionPlantillaService],
  templateUrl: './gestion-plantilla-page.component.html',
  styleUrl: './gestion-plantilla-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionPlantillaPageComponent {
  protected readonly datos = inject(DatosGestionPlantillaService);

  protected readonly jugadorEditando = computed(() => {
    const editando = this.datos.editando();
    return editando === 'nuevo' ? null : editando;
  });

  protected readonly tituloHoja = computed(() => {
    const editando = this.datos.editando();
    return editando === 'nuevo' ? 'Nuevo jugador' : (editando?.nombreMostrar ?? '');
  });
}
