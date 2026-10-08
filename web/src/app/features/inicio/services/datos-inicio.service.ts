import { Injectable, computed, inject, resource } from '@angular/core';
import { AlineacionesService } from '@data-access/alineaciones/alineaciones.service';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { elegirProximaConfrontacion } from '@data-access/confrontaciones/proxima-confrontacion';

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

  readonly faseActual = resource({
    loader: () => this.competiciones.obtenerFaseActual(),
  });

  readonly fase = computed(() => (this.faseActual.hasValue() ? this.faseActual.value() : null));

  readonly clasificacion = resource({
    params: () => this.fase()?.fase.id,
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

  readonly proximaConfrontacion = computed(() => elegirProximaConfrontacion(this.jornadas()));

  readonly alineacion = resource({
    params: () => this.proximaConfrontacion()?.id,
    loader: ({ params: idConfrontacion }) => this.alineaciones.obtenerAlineacion(idConfrontacion),
  });

  readonly partidosAlineacion = computed(() =>
    this.alineacion.hasValue() ? this.alineacion.value() : [],
  );
}
