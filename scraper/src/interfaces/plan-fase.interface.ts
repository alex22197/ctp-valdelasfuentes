/** Una fila de clasificación lista para guardar. */
export interface FilaClasificacionPlan {
  readonly equipoId: string;
  readonly posicion: number;
  readonly puntos: number;
  readonly ganados: number;
  readonly empatados: number;
  readonly perdidos: number;
  readonly partidosFavor: number;
  readonly partidosContra: number;
}

/** Una confrontación que no está en la base de datos y hay que crear. Sin jornada en las eliminatorias. */
export interface ConfrontacionNueva {
  readonly jornada: number | null;
  readonly localId: string;
  readonly visitanteId: string;
  readonly partidosLocal: number | null;
  readonly partidosVisitante: number | null;
  readonly estado: 'programada' | 'jugada';
}

/** Una confrontación de otros equipos cuyo resultado ha publicado la liga. */
export interface ConfrontacionActualizada {
  readonly id: string;
  readonly jornada: number;
  readonly partidosLocal: number;
  readonly partidosVisitante: number;
}

/** Qué cambia en una fase: lo que se escribe y lo que solo se avisa. */
export interface PlanFase {
  readonly clasificacion: readonly FilaClasificacionPlan[];
  readonly nuevas: readonly ConfrontacionNueva[];
  readonly actualizadas: readonly ConfrontacionActualizada[];
  readonly avisos: readonly string[];
}
