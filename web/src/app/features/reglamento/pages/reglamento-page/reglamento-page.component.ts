import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TEMPORADA_NORMATIVA, URL_NORMATIVA } from '@core/config/sitio.constants';
import { GlosarioReglamentoComponent } from '../../components/glosario-reglamento/glosario-reglamento.component';
import { ReglasIncidenciasComponent } from '../../components/reglas-incidencias/reglas-incidencias.component';
import { ReglasJornadaComponent } from '../../components/reglas-jornada/reglas-jornada.component';
import { ReglasPuntosComponent } from '../../components/reglas-puntos/reglas-puntos.component';
import { ReglasTemporadaComponent } from '../../components/reglas-temporada/reglas-temporada.component';

/** Resumen del reglamento de la liga, explicado para todo el equipo. Página pública. */
@Component({
  selector: 'ctp-reglamento-page',
  imports: [
    RouterLink,
    GlosarioReglamentoComponent,
    ReglasIncidenciasComponent,
    ReglasJornadaComponent,
    ReglasPuntosComponent,
    ReglasTemporadaComponent,
  ],
  templateUrl: './reglamento-page.component.html',
  styleUrl: './reglamento-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReglamentoPageComponent {
  protected readonly urlNormativa = URL_NORMATIVA;
  protected readonly temporada = TEMPORADA_NORMATIVA;
}
