import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from '@core/supabase/supabase-client.service';
import { ErrorAccesoDatos, lanzarSiHayError } from '@core/supabase/error-acceso-datos';
import { mapearFormato } from '@data-access/competiciones/competicion.mapper';
import type { MarcadorPartido } from './interfaces/marcador-partido.interface';
import type { PartidoConResultado } from './interfaces/partido-con-resultado.interface';
import { completarPartidosSegunFormato } from './partidos-segun-formato';
import {
  mapearParametrosGuardarResultado,
  mapearPartidoConResultado,
} from './resultado-partido.mapper';

/** Código de PostgreSQL de los `raise exception`: sus mensajes ya están en castellano. */
const CODIGO_ERROR_NORMATIVA = 'P0001';

const COLUMNAS_RESULTADOS = `
  fase(competicion(formato)),
  partido(
    tipo, numero, resultado, ganado,
    set_partido(numero, juegos_nuestros, juegos_rival, tiebreak_nuestros, tiebreak_rival),
    participacion(lado, jugador(id, nombre_mostrar))
  )
`;

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private readonly supabase = inject(SupabaseClientService).cliente;

  /**
   * Todos los partidos de una confrontación según el formato de su competición, con la
   * pareja y el marcador de cada uno. Vacío si la confrontación no existe.
   */
  async obtenerResultados(idConfrontacion: string): Promise<PartidoConResultado[]> {
    const { data, error } = await this.supabase
      .from('confrontacion')
      .select(COLUMNAS_RESULTADOS)
      .eq('id', idConfrontacion)
      .maybeSingle();
    lanzarSiHayError(error, 'No se han podido cargar los resultados.');
    if (!data) {
      return [];
    }
    return completarPartidosSegunFormato(
      mapearFormato(data.fase.competicion.formato),
      data.partido.map(mapearPartidoConResultado),
    );
  }

  /**
   * Guarda el resultado y los sets de un partido en una sola operación. Si la base de datos
   * lo rechaza por la normativa, el error lleva su explicación.
   */
  async guardarResultado(
    idConfrontacion: string,
    partido: Pick<PartidoConResultado, 'tipo' | 'numero'>,
    marcador: MarcadorPartido,
  ): Promise<void> {
    const { error } = await this.supabase.rpc('guardar_resultado_partido', {
      p_confrontacion: idConfrontacion,
      p_tipo: partido.tipo,
      p_numero: partido.numero,
      ...mapearParametrosGuardarResultado(marcador),
    });
    if (error) {
      const mensaje =
        error.code === CODIGO_ERROR_NORMATIVA
          ? `${error.message}.`
          : 'No se ha podido guardar el resultado. Comprueba la conexión y vuelve a intentarlo.';
      throw new ErrorAccesoDatos(mensaje, error);
    }
  }
}
