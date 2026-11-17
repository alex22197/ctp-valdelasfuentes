import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { esUuid } from '@shared/utils/es-uuid';
import type { DatosJugador } from './interfaces/datos-jugador.interface';
import type { JugadorGestion } from './interfaces/jugador-gestion.interface';
import type { JugadorPlantilla } from './interfaces/jugador-plantilla.interface';
import { mapearJugadorGestion } from './jugador-gestion.mapper';
import { mapearJugadorPlantilla } from './jugador.mapper';
import { mapearNombresCompletos } from './nombres-completos.mapper';

/** SQLSTATE de un `raise exception` nuestro: su mensaje ya está en castellano. */
const EXCEPCION_PROPIA = 'P0001';

@Injectable({ providedIn: 'root' })
export class JugadoresService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /** Un jugador de la plantilla de una competición. `null` si no está o el id no es válido. */
  async obtenerJugadorDePlantilla(
    idCompeticion: string,
    idJugador: string,
  ): Promise<JugadorPlantilla | null> {
    if (!esUuid(idJugador)) {
      return null;
    }
    const { data, error } = await this.supabase
      .from('plantilla')
      .select('comodin, jugador(id, nombre_mostrar, sexo, lado_preferido)')
      .eq('competicion_id', idCompeticion)
      .eq('jugador_id', idJugador)
      .maybeSingle();
    lanzarSiHayError(error, 'No se ha podido cargar el jugador.');
    return data ? mapearJugadorPlantilla(data) : null;
  }

  /** Jugadores en la plantilla de una competición que no se han dado de baja. */
  async obtenerPlantilla(idCompeticion: string): Promise<JugadorPlantilla[]> {
    const { data, error } = await this.supabase
      .from('plantilla')
      .select('comodin, jugador(id, nombre_mostrar, sexo, lado_preferido)')
      .eq('competicion_id', idCompeticion)
      .is('baja', null);
    lanzarSiHayError(error, 'No se ha podido cargar la plantilla.');
    return (data ?? []).map(mapearJugadorPlantilla);
  }

  /** Ids de los comodines de una competición: no tienen ficha pública. */
  async obtenerIdsComodines(idCompeticion: string): Promise<ReadonlySet<string>> {
    const { data, error } = await this.supabase
      .from('plantilla')
      .select('jugador_id')
      .eq('competicion_id', idCompeticion)
      .eq('comodin', true);
    lanzarSiHayError(error, 'No se han podido cargar los comodines.');
    return new Set((data ?? []).map((fila) => fila.jugador_id));
  }

  /**
   * Toda la plantilla de una competición para gestionarla, bajas incluidas. El nombre completo
   * solo llega a los gestores.
   */
  async obtenerPlantillaGestion(idCompeticion: string): Promise<JugadorGestion[]> {
    const { data, error } = await this.supabase
      .from('plantilla')
      .select(
        'comodin, inscrito_oficial, baja, jugador(id, nombre_mostrar, sexo, lado_preferido, jugador_privado(nombre_completo))',
      )
      .eq('competicion_id', idCompeticion);
    lanzarSiHayError(error, 'No se ha podido cargar la plantilla.');
    return (data ?? []).map(mapearJugadorGestion);
  }

  /** Crea o cambia un jugador y su sitio en la plantilla, en una sola transacción. */
  async guardarJugador(idCompeticion: string, datos: DatosJugador): Promise<string> {
    const { data, error } = await this.supabase.rpc('guardar_jugador', {
      p_competicion: idCompeticion,
      p_nombre_mostrar: datos.nombreMostrar,
      p_sexo: datos.sexo,
      p_jugador: datos.id ?? undefined,
      p_nombre_completo: datos.nombreCompleto ?? undefined,
      p_lado: datos.ladoPreferido ?? undefined,
      p_comodin: datos.comodin,
      p_inscrito: datos.inscritoOficial ?? undefined,
    });
    this.lanzarConMensaje(error, 'No se ha podido guardar el jugador.');
    return data;
  }

  /** Da de baja a un jugador de la plantilla (hoy) o lo reincorpora. */
  async cambiarBaja(idCompeticion: string, idJugador: string, baja: boolean): Promise<void> {
    const { error } = await this.supabase.rpc('cambiar_baja_jugador', {
      p_competicion: idCompeticion,
      p_jugador: idJugador,
      p_baja: baja,
    });
    this.lanzarConMensaje(error, 'No se ha podido cambiar la baja.');
  }

  /**
   * Nombre completo de los jugadores indicados que lo tienen. Es privado: solo responde a
   * los gestores; para el resto devuelve vacío.
   */
  async obtenerNombresCompletos(
    idsJugador: readonly string[],
  ): Promise<ReadonlyMap<string, string>> {
    if (idsJugador.length === 0) {
      return new Map();
    }
    const { data, error } = await this.supabase
      .from('jugador_privado')
      .select('jugador_id, nombre_completo')
      .in('jugador_id', [...idsJugador]);
    lanzarSiHayError(error, 'No se han podido cargar los nombres completos.');
    return mapearNombresCompletos(data ?? []);
  }

  /** Los mensajes que levanta la propia función (en castellano) llegan tal cual al usuario. */
  private lanzarConMensaje(
    error: { code?: string; message: string } | null,
    porDefecto: string,
  ): asserts error is null {
    if (error) {
      throw new ErrorAccesoDatos(
        error.code === EXCEPCION_PROPIA ? error.message : porDefecto,
        error,
      );
    }
  }
}
