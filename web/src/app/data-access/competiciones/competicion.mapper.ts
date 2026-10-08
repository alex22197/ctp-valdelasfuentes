import type { Tables } from '@core/supabase/interfaces/database.types';
import type { Competicion } from './interfaces/competicion.interface';
import type { Fase } from './interfaces/fase.interface';

type FilaCompeticion = Pick<Tables<'competicion'>, 'id' | 'nombre' | 'temporada'>;
type FilaFase = Pick<Tables<'fase'>, 'id' | 'tipo' | 'nombre' | 'orden' | 'url_grupo' | 'inicio'>;

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
  };
}
