import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../web/src/app/core/supabase/interfaces/database.types.ts';
import type { ConfrontacionConocida } from './interfaces/confrontacion-conocida.interface.ts';
import type { EquipoConocido } from './interfaces/equipo-conocido.interface.ts';
import type { FaseALeer } from './interfaces/fase-a-leer.interface.ts';
import type { MarcadorNuestro } from './interfaces/marcador-nuestro.interface.ts';
import type { PlanFase } from './interfaces/plan-fase.interface.ts';

/** La URL del proyecto es pública (va también en la web); la clave secreta, solo en secretos. */
const URL_SUPABASE = 'https://wqnelcngcnubwtymnmjk.supabase.co';

/**
 * Lecturas y escrituras del scraper, con la clave secreta (`service_role`), que se salta RLS.
 * Solo toca `equipo`, `fase_equipo`, `confrontacion` y `ejecucion_scraper`, y de
 * `confrontacion` solo el resultado y el estado de las de otros equipos: nunca la fecha, la
 * sede ni las pistas, que las ponen los gestores.
 */
export class BaseDeDatos {
  private readonly cliente: SupabaseClient<Database>;

  constructor(claveSecreta: string) {
    this.cliente = createClient<Database>(
      process.env['SUPABASE_URL'] ?? URL_SUPABASE,
      claveSecreta,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      },
    );
  }

  async fasesConPagina(): Promise<FaseALeer[]> {
    const { data, error } = await this.cliente
      .from('fase')
      .select('id, nombre, tipo, url_grupo, inicio, fin')
      .not('url_grupo', 'is', null)
      .order('orden');
    lanzar(error, 'leer las fases');
    return (data ?? []).flatMap((f) =>
      f.url_grupo
        ? [
            {
              id: f.id,
              nombre: f.nombre,
              tipo: f.tipo,
              urlGrupo: f.url_grupo,
              inicio: f.inicio,
              fin: f.fin,
            },
          ]
        : [],
    );
  }

  async equipos(): Promise<EquipoConocido[]> {
    const { data, error } = await this.cliente
      .from('equipo')
      .select('id, nombre, nombre_web, es_nuestro');
    lanzar(error, 'leer los equipos');
    return (data ?? []).map((e) => ({
      id: e.id,
      nombre: e.nombre,
      nombreWeb: e.nombre_web,
      esNuestro: e.es_nuestro,
    }));
  }

  async crearEquipo(nombre: string): Promise<EquipoConocido> {
    const { data, error } = await this.cliente
      .from('equipo')
      .insert({ nombre, nombre_web: nombre, es_nuestro: false })
      .select('id, nombre, nombre_web, es_nuestro')
      .single();
    lanzar(error, `crear el equipo «${nombre}»`);
    return {
      id: data.id,
      nombre: data.nombre,
      nombreWeb: data.nombre_web,
      esNuestro: data.es_nuestro,
    };
  }

  async ponerNombreWeb(id: string, nombreWeb: string): Promise<void> {
    const { error } = await this.cliente
      .from('equipo')
      .update({ nombre_web: nombreWeb })
      .eq('id', id);
    lanzar(error, `guardar el nombre en la liga de «${nombreWeb}»`);
  }

  async confrontacionesDeFase(faseId: string): Promise<ConfrontacionConocida[]> {
    const { data, error } = await this.cliente
      .from('confrontacion')
      .select('id, jornada, local_id, visitante_id, partidos_local, partidos_visitante, estado')
      .eq('fase_id', faseId);
    lanzar(error, 'leer las confrontaciones');
    return (data ?? []).map((c) => ({
      id: c.id,
      jornada: c.jornada,
      localId: c.local_id,
      visitanteId: c.visitante_id,
      partidosLocal: c.partidos_local,
      partidosVisitante: c.partidos_visitante,
      estado: c.estado,
    }));
  }

  async marcadoresNuestros(idsConfrontacion: readonly string[]): Promise<MarcadorNuestro[]> {
    if (idsConfrontacion.length === 0) {
      return [];
    }
    const { data, error } = await this.cliente
      .from('confrontacion_marcador')
      .select('confrontacion_id, partidos_ganados, partidos_perdidos, partidos_pendientes')
      .in('confrontacion_id', [...idsConfrontacion]);
    lanzar(error, 'leer nuestros marcadores');
    return (data ?? []).flatMap((m) =>
      m.confrontacion_id
        ? [
            {
              confrontacionId: m.confrontacion_id,
              partidosGanados: m.partidos_ganados ?? 0,
              partidosPerdidos: m.partidos_perdidos ?? 0,
              partidosPendientes: m.partidos_pendientes ?? 0,
            },
          ]
        : [],
    );
  }

  async aplicarPlan(faseId: string, plan: PlanFase): Promise<void> {
    if (plan.clasificacion.length > 0) {
      const ahora = new Date().toISOString();
      const { error } = await this.cliente.from('fase_equipo').upsert(
        plan.clasificacion.map((f) => ({
          fase_id: faseId,
          equipo_id: f.equipoId,
          posicion: f.posicion,
          puntos: f.puntos,
          ganados: f.ganados,
          empatados: f.empatados,
          perdidos: f.perdidos,
          partidos_favor: f.partidosFavor,
          partidos_contra: f.partidosContra,
          actualizado_en: ahora,
        })),
        { onConflict: 'fase_id,equipo_id' },
      );
      lanzar(error, 'guardar la clasificación');
    }
    if (plan.nuevas.length > 0) {
      const { error } = await this.cliente.from('confrontacion').insert(
        plan.nuevas.map((n) => ({
          fase_id: faseId,
          jornada: n.jornada,
          local_id: n.localId,
          visitante_id: n.visitanteId,
          partidos_local: n.partidosLocal,
          partidos_visitante: n.partidosVisitante,
          estado: n.estado,
        })),
      );
      lanzar(error, 'crear las confrontaciones nuevas');
    }
    for (const a of plan.actualizadas) {
      const { error } = await this.cliente
        .from('confrontacion')
        .update({
          partidos_local: a.partidosLocal,
          partidos_visitante: a.partidosVisitante,
          estado: 'jugada',
        })
        .eq('id', a.id);
      lanzar(error, `guardar el resultado de la jornada ${a.jornada}`);
    }
  }

  async registrarEjecucion(ok: boolean, mensaje: string): Promise<void> {
    const { error } = await this.cliente.from('ejecucion_scraper').insert({ ok, mensaje });
    lanzar(error, 'registrar la ejecución');
  }
}

function lanzar(error: { message: string } | null, accion: string): asserts error is null {
  if (error) {
    throw new Error(`No se ha podido ${accion}: ${error.message}`);
  }
}
