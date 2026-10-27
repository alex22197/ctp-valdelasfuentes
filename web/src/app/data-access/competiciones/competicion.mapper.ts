import type { Json, Tables } from '@core/supabase/interfaces/database.types';
import type { Competicion } from './interfaces/competicion.interface';
import type { FormatoCompeticion } from './interfaces/formato-competicion.interface';
import type { Fase } from './interfaces/fase.interface';

type FilaCompeticion = Pick<Tables<'competicion'>, 'id' | 'nombre' | 'temporada'>;
type FilaFase = Pick<
  Tables<'fase'>,
  'id' | 'tipo' | 'nombre' | 'orden' | 'url_grupo' | 'inicio' | 'fin'
>;

export function mapearCompeticion(fila: FilaCompeticion): Competicion {
  return { id: fila.id, nombre: fila.nombre, temporada: fila.temporada };
}

export function mapearFase(fila: FilaFase): Fase {
  return {
    id: fila.id,
    tipo: fila.tipo,
    nombre: fila.nombre,
    orden: fila.orden,
    urlGrupo: fila.url_grupo,
    inicio: fila.inicio,
    fin: fila.fin,
  };
}

/**
 * Lee el formato guardado como JSON en `competicion.formato`. La base de datos garantiza
 * que tiene las tres claves; un valor que no sea número se toma como 0 partidos.
 */
export function mapearFormato(formato: Json): FormatoCompeticion {
  const valores =
    typeof formato === 'object' && formato !== null && !Array.isArray(formato) ? formato : {};
  const numeroDe = (clave: keyof FormatoCompeticion): number => {
    const valor = valores[clave];
    return typeof valor === 'number' && Number.isInteger(valor) && valor > 0 ? valor : 0;
  };
  return {
    masculino: numeroDe('masculino'),
    femenino: numeroDe('femenino'),
    mixto: numeroDe('mixto'),
  };
}
