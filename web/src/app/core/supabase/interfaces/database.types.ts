/**
 * Tipos de la base de datos de Supabase.
 *
 * FICHERO GENERADO: no editar a mano. Se regenera desde la raíz del repositorio con
 * `npm run db:tipos` después de aplicar una migración nueva.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      competicion: {
        Row: {
          id: string;
          nombre: string;
          temporada: string;
          formato: Json;
          activa: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          temporada: string;
          formato?: Json;
          activa?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          temporada?: string;
          formato?: Json;
          activa?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      confrontacion: {
        Row: {
          id: string;
          fase_id: string;
          jornada: number | null;
          local_id: string;
          visitante_id: string;
          fecha_prevista: string | null;
          fecha_hora: string | null;
          sede: string | null;
          num_pistas: number | null;
          estado: Database['public']['Enums']['estado_confrontacion'];
          partidos_local: number | null;
          partidos_visitante: number | null;
          acta_enviada: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          fase_id: string;
          jornada?: number | null;
          local_id: string;
          visitante_id: string;
          fecha_prevista?: string | null;
          fecha_hora?: string | null;
          sede?: string | null;
          num_pistas?: number | null;
          estado?: Database['public']['Enums']['estado_confrontacion'];
          partidos_local?: number | null;
          partidos_visitante?: number | null;
          acta_enviada?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          fase_id?: string;
          jornada?: number | null;
          local_id?: string;
          visitante_id?: string;
          fecha_prevista?: string | null;
          fecha_hora?: string | null;
          sede?: string | null;
          num_pistas?: number | null;
          estado?: Database['public']['Enums']['estado_confrontacion'];
          partidos_local?: number | null;
          partidos_visitante?: number | null;
          acta_enviada?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'confrontacion_fase_id_fkey';
            columns: ['fase_id'];
            isOneToOne: false;
            referencedRelation: 'fase';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'confrontacion_local_id_fkey';
            columns: ['local_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'confrontacion_visitante_id_fkey';
            columns: ['visitante_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
        ];
      };
      disponibilidad: {
        Row: {
          confrontacion_id: string;
          jugador_id: string;
          respuesta: Database['public']['Enums']['respuesta_encuesta'] | null;
          convocado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          confrontacion_id: string;
          jugador_id: string;
          respuesta?: Database['public']['Enums']['respuesta_encuesta'] | null;
          convocado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          confrontacion_id?: string;
          jugador_id?: string;
          respuesta?: Database['public']['Enums']['respuesta_encuesta'] | null;
          convocado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'disponibilidad_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'disponibilidad_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      ejecucion_scraper: {
        Row: {
          id: string;
          fecha: string;
          ok: boolean;
          mensaje: string | null;
        };
        Insert: {
          id?: string;
          fecha?: string;
          ok: boolean;
          mensaje?: string | null;
        };
        Update: {
          id?: string;
          fecha?: string;
          ok?: boolean;
          mensaje?: string | null;
        };
        Relationships: [];
      };
      equipo: {
        Row: {
          id: string;
          nombre: string;
          nombre_web: string | null;
          sede: string | null;
          es_nuestro: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          nombre_web?: string | null;
          sede?: string | null;
          es_nuestro?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          nombre_web?: string | null;
          sede?: string | null;
          es_nuestro?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      fase: {
        Row: {
          id: string;
          competicion_id: string;
          tipo: Database['public']['Enums']['tipo_fase'];
          nombre: string;
          orden: number;
          url_grupo: string | null;
          inicio: string | null;
          fin: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          competicion_id: string;
          tipo: Database['public']['Enums']['tipo_fase'];
          nombre: string;
          orden: number;
          url_grupo?: string | null;
          inicio?: string | null;
          fin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          competicion_id?: string;
          tipo?: Database['public']['Enums']['tipo_fase'];
          nombre?: string;
          orden?: number;
          url_grupo?: string | null;
          inicio?: string | null;
          fin?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
        ];
      };
      fase_equipo: {
        Row: {
          fase_id: string;
          equipo_id: string;
          posicion: number | null;
          puntos: number;
          ganados: number;
          empatados: number;
          perdidos: number;
          actualizado_en: string | null;
        };
        Insert: {
          fase_id: string;
          equipo_id: string;
          posicion?: number | null;
          puntos?: number;
          ganados?: number;
          empatados?: number;
          perdidos?: number;
          actualizado_en?: string | null;
        };
        Update: {
          fase_id?: string;
          equipo_id?: string;
          posicion?: number | null;
          puntos?: number;
          ganados?: number;
          empatados?: number;
          perdidos?: number;
          actualizado_en?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'fase_equipo_equipo_id_fkey';
            columns: ['equipo_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'fase_equipo_fase_id_fkey';
            columns: ['fase_id'];
            isOneToOne: false;
            referencedRelation: 'fase';
            referencedColumns: ['id'];
          },
        ];
      };
      jugador: {
        Row: {
          id: string;
          nombre_mostrar: string;
          sexo: Database['public']['Enums']['sexo'];
          lado_preferido: Database['public']['Enums']['lado'] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre_mostrar: string;
          sexo: Database['public']['Enums']['sexo'];
          lado_preferido?: Database['public']['Enums']['lado'] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre_mostrar?: string;
          sexo?: Database['public']['Enums']['sexo'];
          lado_preferido?: Database['public']['Enums']['lado'] | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      jugador_privado: {
        Row: {
          jugador_id: string;
          nombre_completo: string | null;
          updated_at: string;
        };
        Insert: {
          jugador_id: string;
          nombre_completo?: string | null;
          updated_at?: string;
        };
        Update: {
          jugador_id?: string;
          nombre_completo?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'jugador_privado_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: true;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      participacion: {
        Row: {
          partido_id: string;
          jugador_id: string;
          lado: Database['public']['Enums']['lado'];
        };
        Insert: {
          partido_id: string;
          jugador_id: string;
          lado: Database['public']['Enums']['lado'];
        };
        Update: {
          partido_id?: string;
          jugador_id?: string;
          lado?: Database['public']['Enums']['lado'];
        };
        Relationships: [
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
      partido: {
        Row: {
          id: string;
          confrontacion_id: string;
          tipo: Database['public']['Enums']['tipo_partido'];
          numero: number;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          ganado: boolean | null;
          pareja_rival: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          confrontacion_id: string;
          tipo: Database['public']['Enums']['tipo_partido'];
          numero: number;
          resultado?: Database['public']['Enums']['resultado_partido'] | null;
          ganado?: boolean | null;
          pareja_rival?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          confrontacion_id?: string;
          tipo?: Database['public']['Enums']['tipo_partido'];
          numero?: number;
          resultado?: Database['public']['Enums']['resultado_partido'] | null;
          ganado?: boolean | null;
          pareja_rival?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion';
            referencedColumns: ['id'];
          },
        ];
      };
      perfil: {
        Row: {
          user_id: string;
          rol: Database['public']['Enums']['rol_usuario'];
          jugador_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          rol: Database['public']['Enums']['rol_usuario'];
          jugador_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          rol?: Database['public']['Enums']['rol_usuario'];
          jugador_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'perfil_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: true;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      plantilla: {
        Row: {
          competicion_id: string;
          jugador_id: string;
          comodin: boolean;
          inscrito_oficial: boolean | null;
          alta: string | null;
          baja: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          competicion_id: string;
          jugador_id: string;
          comodin?: boolean;
          inscrito_oficial?: boolean | null;
          alta?: string | null;
          baja?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          competicion_id?: string;
          jugador_id?: string;
          comodin?: boolean;
          inscrito_oficial?: boolean | null;
          alta?: string | null;
          baja?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'plantilla_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'plantilla_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      set_partido: {
        Row: {
          partido_id: string;
          numero: number;
          juegos_nuestros: number;
          juegos_rival: number;
          tiebreak_nuestros: number | null;
          tiebreak_rival: number | null;
        };
        Insert: {
          partido_id: string;
          numero: number;
          juegos_nuestros: number;
          juegos_rival: number;
          tiebreak_nuestros?: number | null;
          tiebreak_rival?: number | null;
        };
        Update: {
          partido_id?: string;
          numero?: number;
          juegos_nuestros?: number;
          juegos_rival?: number;
          tiebreak_nuestros?: number | null;
          tiebreak_rival?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'set_partido_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      partido_resultado: {
        Row: {
          partido_id: string | null;
          confrontacion_id: string | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
          numero: number | null;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          sets_nuestros: number | null;
          sets_rival: number | null;
          juegos_nuestros: number | null;
          juegos_rival: number | null;
          ganado: boolean | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      competicion_de_confrontacion: { Args: { p_confrontacion: string }; Returns: string };
      es_admin: { Args: never; Returns: boolean };
      es_gestor: { Args: never; Returns: boolean };
      juega_nuestro_equipo: { Args: { p_confrontacion: string }; Returns: boolean };
    };
    Enums: {
      estado_confrontacion:
        'programada' | 'aplazada' | 'suspendida' | 'jugada' | 'no_comparecencia';
      lado: 'reves' | 'drive';
      respuesta_encuesta: 'si' | 'no';
      resultado_partido: 'normal' | 'wo_favor' | 'wo_contra' | 'abandono' | 'suspendido';
      rol_usuario: 'admin' | 'capitan';
      sexo: 'masculino' | 'femenino';
      tipo_fase: 'apertura' | 'retos' | 'clausura' | 'previa_playoff' | 'playoff' | 'masters';
      tipo_partido: 'masculino' | 'femenino' | 'mixto';
    };
    CompositeTypes: Record<never, never>;
  };
};

type EsquemaPublico = Database['public'];

/** Fila de una tabla o vista: `Tables<'jugador'>`. */
export type Tables<T extends keyof EsquemaPublico['Tables'] | keyof EsquemaPublico['Views']> =
  T extends keyof EsquemaPublico['Tables']
    ? EsquemaPublico['Tables'][T]['Row']
    : T extends keyof EsquemaPublico['Views']
      ? EsquemaPublico['Views'][T]['Row']
      : never;

/** Valores posibles de un enum: `Enums<'tipo_partido'>`. */
export type Enums<T extends keyof EsquemaPublico['Enums']> = EsquemaPublico['Enums'][T];
