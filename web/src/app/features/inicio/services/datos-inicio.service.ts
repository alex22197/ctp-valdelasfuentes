import { Injectable, computed, inject, resource } from '@angular/core';
import { AlineacionesService } from '@data-access/alineaciones/alineaciones.service';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { elegirProximaConfrontacion } from '@data-access/confrontaciones/proxima-confrontacion';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { describirFechaCorta, fechaIsoEnMadrid } from '@shared/utils/fechas';

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

  readonly calendario = resource({
    params: () => this.fase()?.fase.id,
    loader: ({ params: idFase }) => this.confrontaciones.obtenerCalendarioNuestroEquipo(idFase),
  });

  readonly jornadas = computed(() => (this.calendario.hasValue() ? this.calendario.value() : []));

  readonly filasClasificacion = computed(() =>
    this.clasificacion.hasValue() ? this.clasificacion.value() : [],
  );

  readonly proximaConfrontacion = computed(() =>
    elegirProximaConfrontacion(this.jornadas(), fechaIsoEnMadrid(new Date())),
  );

  /** Sin calendario todavía (los retos hasta que la liga publica el cruce), cuándo empieza la fase. */
  readonly avisoFase = computed(() => {
    const fase = this.fase()?.fase;
    if (!fase || this.jornadas().length > 0 || !this.calendario.hasValue()) {
      return null;
    }
    return `${fase.nombre}: ${describirFechaCorta(null, fase.inicio)}. El cruce lo publica la liga.`;
  });

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
