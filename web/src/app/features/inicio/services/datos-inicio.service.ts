import { Injectable, computed, inject, resource } from '@angular/core';
import { AlineacionesService } from '@data-access/alineaciones/alineaciones.service';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { estadoFase } from '@data-access/competiciones/estado-fase';
import type { EstadoFase } from '@data-access/competiciones/interfaces/estado-fase.type';
import type { Fase } from '@data-access/competiciones/interfaces/fase.interface';
import {
  aplanarCalendario,
  conFaseActual,
  ultimaJugada,
} from '@data-access/confrontaciones/calendario-competicion';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { elegirProximaConfrontacion } from '@data-access/confrontaciones/proxima-confrontacion';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';

/**
 * Datos de la página de inicio y sus dependencias: primero la fase actual, después su
 * clasificación y calendario, y por último la alineación del próximo partido.
 * Se provee en la propia página, así que vive y muere con ella.
 */
@Injectable()
export class DatosInicioService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly clasificaciones = inject(ClasificacionService);
  private readonly confrontaciones = inject(ConfrontacionesService);
  private readonly alineaciones = inject(AlineacionesService);
  private readonly jugadores = inject(JugadoresService);

  readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  readonly fase = computed(() => (this.faseActual.hasValue() ? this.faseActual.value() : null));

  /** La fase cuya clasificación se enseña: en los retos, la de la apertura. */
  readonly faseClasificacion = computed(() => this.fase()?.faseClasificacion ?? null);

  readonly clasificacion = resource({
    params: () => this.faseClasificacion()?.id,
    loader: ({ params: idFase }) => this.clasificaciones.obtenerClasificacion(idFase),
  });

  /** Las jornadas de toda la competición por fase: también las de las fases que ya terminaron. */
  readonly calendario = resource({
    params: () => this.fase()?.competicion.id,
    loader: ({ params: idCompeticion }) =>
      this.confrontaciones.obtenerCalendarioCompeticion(idCompeticion),
  });

  private readonly porFase = computed(() =>
    this.calendario.hasValue() ? this.calendario.value() : [],
  );

  /** El calendario por fases para la portada, con la actual aunque aún no tenga partidos. */
  readonly calendarioPorFase = computed(() => {
    const actual = this.fase()?.fase;
    return actual ? conFaseActual(this.porFase(), actual) : this.porFase();
  });

  readonly jornadas = computed(() => aplanarCalendario(this.porFase()));

  readonly filasClasificacion = computed(() =>
    this.clasificacion.hasValue() ? this.clasificacion.value() : [],
  );

  /** Entre todas las fases: una aplazada de la anterior sigue siendo la próxima. */
  readonly proximaConfrontacion = computed(() =>
    elegirProximaConfrontacion(this.jornadas(), fechaIsoEnMadrid(new Date())),
  );

  /** La fase que viene cuando todavía no tiene partido (los retos hasta que la liga publica el cruce). */
  readonly faseSinCruce = computed(() => {
    const actual = this.fase()?.fase;
    if (!actual || !this.calendario.hasValue()) {
      return null;
    }
    const suya = this.porFase().find((grupo) => grupo.fase.id === actual.id);
    return suya && suya.confrontaciones.length > 0 ? null : actual;
  });

  /** Entre dos fases, el último partido jugado, para que la portada no se quede vacía. */
  readonly ultimoPartido = computed(() => ultimaJugada(this.porFase()));

  /** Si cada fase del calendario ya terminó, es la que se juega o viene después. */
  estadoDe(fase: Fase): EstadoFase {
    return estadoFase(fase, this.fase()?.fase ?? null);
  }

  /** Solo la alineación publicada: un borrador del capitán no se enseña en público. */
  readonly alineacion = resource({
    params: () => {
      const proxima = this.proximaConfrontacion();
      return proxima?.convocatoriaPublicada ? proxima.id : undefined;
    },
    loader: ({ params: idConfrontacion }) => this.alineaciones.obtenerAlineacion(idConfrontacion),
  });

  readonly partidosAlineacion = computed(() =>
    this.alineacion.hasValue() ? this.alineacion.value() : [],
  );

  /** Comodines de la competición: sus nombres en la convocatoria no llevan a ninguna ficha. */
  private readonly comodines = resource({
    params: () => this.fase()?.competicion.id,
    loader: ({ params: idCompeticion }) => this.jugadores.obtenerIdsComodines(idCompeticion),
  });

  readonly idsComodines = computed<ReadonlySet<string>>(() =>
    this.comodines.hasValue() ? this.comodines.value() : new Set(),
  );
}
