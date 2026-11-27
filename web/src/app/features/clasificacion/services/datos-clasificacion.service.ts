import { Injectable, computed, inject, resource } from '@angular/core';
import { ClasificacionService } from '@data-access/clasificacion/clasificacion.service';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConfrontacionesService } from '@data-access/confrontaciones/confrontaciones.service';
import { fechaIsoEnMadrid } from '@shared/utils/fechas';
import type { BloqueClasificacion } from '../interfaces/bloque-clasificacion.interface';
import type { FaseConEstado } from '../interfaces/fase-con-estado.interface';
import { fasesConClasificacion } from '../utils/fases-con-clasificacion';
import { agruparPorJornada } from '@data-access/confrontaciones/jornadas-grupo';
import { describirActualizacion } from '../utils/ultima-actualizacion';

/**
 * Datos de la página de clasificación: cada fase de liga de la temporada (la más reciente
 * primero) con su clasificación oficial y las jornadas de su grupo. Se provee en la página.
 */
@Injectable()
export class DatosClasificacionService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly clasificaciones = inject(ClasificacionService);
  private readonly confrontaciones = inject(ConfrontacionesService);

  readonly competicionActiva = resource({
    loader: () => this.competiciones.obtenerCompeticionActivaConFases(),
  });

  readonly competicion = computed(() =>
    this.competicionActiva.hasValue()
      ? (this.competicionActiva.value()?.competicion ?? null)
      : null,
  );

  private readonly fases = computed((): FaseConEstado[] | undefined => {
    if (!this.competicionActiva.hasValue()) {
      return undefined;
    }
    const activa = this.competicionActiva.value();
    return activa ? fasesConClasificacion(activa.fases, fechaIsoEnMadrid(new Date())) : [];
  });

  /** Las clasificaciones y jornadas de todas las fases de liga, cargadas a la vez. */
  readonly bloques = resource({
    params: this.fases,
    loader: ({ params: fases }) => Promise.all(fases.map((fase) => this.cargarBloque(fase))),
  });

  readonly lista = computed(() => (this.bloques.hasValue() ? this.bloques.value() : []));

  readonly cargando = computed(
    () => this.competicionActiva.isLoading() || this.bloques.isLoading(),
  );

  readonly error = computed(() => this.competicionActiva.error() ?? this.bloques.error() ?? null);

  private async cargarBloque(faseConEstado: FaseConEstado): Promise<BloqueClasificacion> {
    const [filas, enfrentamientos] = await Promise.all([
      this.clasificaciones.obtenerClasificacion(faseConEstado.fase.id),
      this.confrontaciones.obtenerEnfrentamientosDelGrupo(faseConEstado.fase.id),
    ]);
    return {
      ...faseConEstado,
      filas,
      jornadas: agruparPorJornada(enfrentamientos),
      nota: describirActualizacion(filas),
    };
  }
}
