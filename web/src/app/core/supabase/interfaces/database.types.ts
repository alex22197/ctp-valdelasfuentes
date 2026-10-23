export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      competicion: {
        Row: {
          activa: boolean;
          created_at: string;
          formato: Json;
          id: string;
          nombre: string;
          temporada: string;
          updated_at: string;
        };
        Insert: {
          activa?: boolean;
          created_at?: string;
          formato?: Json;
          id?: string;
          nombre: string;
          temporada: string;
          updated_at?: string;
        };
        Update: {
          activa?: boolean;
          created_at?: string;
          formato?: Json;
          id?: string;
          nombre?: string;
          temporada?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      confrontacion: {
        Row: {
          acta_enviada: boolean;
          convocatoria_publicada: boolean;
          created_at: string;
          estado: Database['public']['Enums']['estado_confrontacion'];
          fase_id: string;
          fecha_hora: string | null;
          fecha_prevista: string | null;
          id: string;
          jornada: number | null;
          local_id: string;
          num_pistas: number | null;
          partidos_local: number | null;
          partidos_visitante: number | null;
          sede: string | null;
          updated_at: string;
          visitante_id: string;
        };
        Insert: {
          acta_enviada?: boolean;
          convocatoria_publicada?: boolean;
          created_at?: string;
          estado?: Database['public']['Enums']['estado_confrontacion'];
          fase_id: string;
          fecha_hora?: string | null;
          fecha_prevista?: string | null;
          id?: string;
          jornada?: number | null;
          local_id: string;
          num_pistas?: number | null;
          partidos_local?: number | null;
          partidos_visitante?: number | null;
          sede?: string | null;
          updated_at?: string;
          visitante_id: string;
        };
        Update: {
          acta_enviada?: boolean;
          convocatoria_publicada?: boolean;
          created_at?: string;
          estado?: Database['public']['Enums']['estado_confrontacion'];
          fase_id?: string;
          fecha_hora?: string | null;
          fecha_prevista?: string | null;
          id?: string;
          jornada?: number | null;
          local_id?: string;
          num_pistas?: number | null;
          partidos_local?: number | null;
          partidos_visitante?: number | null;
          sede?: string | null;
          updated_at?: string;
          visitante_id?: string;
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
            foreignKeyName: 'confrontacion_local_id_fkey';
            columns: ['local_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['rival_id'];
          },
          {
            foreignKeyName: 'confrontacion_local_id_fkey';
            columns: ['local_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['rival_id'];
          },
          {
            foreignKeyName: 'confrontacion_visitante_id_fkey';
            columns: ['visitante_id'];
            isOneToOne: false;
            referencedRelation: 'equipo';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'confrontacion_visitante_id_fkey';
            columns: ['visitante_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['rival_id'];
          },
          {
            foreignKeyName: 'confrontacion_visitante_id_fkey';
            columns: ['visitante_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['rival_id'];
          },
        ];
      };
      cuenta_revisada: {
        Row: {
          created_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      disponibilidad: {
        Row: {
          confrontacion_id: string;
          convocado: boolean;
          created_at: string;
          jugador_id: string;
          respuesta: Database['public']['Enums']['respuesta_encuesta'] | null;
          updated_at: string;
        };
        Insert: {
          confrontacion_id: string;
          convocado?: boolean;
          created_at?: string;
          jugador_id: string;
          respuesta?: Database['public']['Enums']['respuesta_encuesta'] | null;
          updated_at?: string;
        };
        Update: {
          confrontacion_id?: string;
          convocado?: boolean;
          created_at?: string;
          jugador_id?: string;
          respuesta?: Database['public']['Enums']['respuesta_encuesta'] | null;
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
            foreignKeyName: 'disponibilidad_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion_marcador';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'disponibilidad_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'disponibilidad_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_equipo';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'disponibilidad_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['confrontacion_id'];
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
          fecha: string;
          id: string;
          mensaje: string | null;
          ok: boolean;
        };
        Insert: {
          fecha?: string;
          id?: string;
          mensaje?: string | null;
          ok: boolean;
        };
        Update: {
          fecha?: string;
          id?: string;
          mensaje?: string | null;
          ok?: boolean;
        };
        Relationships: [];
      };
      equipo: {
        Row: {
          created_at: string;
          es_nuestro: boolean;
          id: string;
          nombre: string;
          nombre_web: string | null;
          sede: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          es_nuestro?: boolean;
          id?: string;
          nombre: string;
          nombre_web?: string | null;
          sede?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          es_nuestro?: boolean;
          id?: string;
          nombre?: string;
          nombre_web?: string | null;
          sede?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      fase: {
        Row: {
          competicion_id: string;
          created_at: string;
          fin: string | null;
          id: string;
          inicio: string | null;
          nombre: string;
          orden: number;
          tipo: Database['public']['Enums']['tipo_fase'];
          updated_at: string;
          url_grupo: string | null;
        };
        Insert: {
          competicion_id: string;
          created_at?: string;
          fin?: string | null;
          id?: string;
          inicio?: string | null;
          nombre: string;
          orden: number;
          tipo: Database['public']['Enums']['tipo_fase'];
          updated_at?: string;
          url_grupo?: string | null;
        };
        Update: {
          competicion_id?: string;
          created_at?: string;
          fin?: string | null;
          id?: string;
          inicio?: string | null;
          nombre?: string;
          orden?: number;
          tipo?: Database['public']['Enums']['tipo_fase'];
          updated_at?: string;
          url_grupo?: string | null;
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
          actualizado_en: string | null;
          empatados: number;
          equipo_id: string;
          fase_id: string;
          ganados: number;
          partidos_contra: number | null;
          partidos_favor: number | null;
          perdidos: number;
          posicion: number | null;
          puntos: number;
        };
        Insert: {
          actualizado_en?: string | null;
          empatados?: number;
          equipo_id: string;
          fase_id: string;
          ganados?: number;
          partidos_contra?: number | null;
          partidos_favor?: number | null;
          perdidos?: number;
          posicion?: number | null;
          puntos?: number;
        };
        Update: {
          actualizado_en?: string | null;
          empatados?: number;
          equipo_id?: string;
          fase_id?: string;
          ganados?: number;
          partidos_contra?: number | null;
          partidos_favor?: number | null;
          perdidos?: number;
          posicion?: number | null;
          puntos?: number;
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
            foreignKeyName: 'fase_equipo_equipo_id_fkey';
            columns: ['equipo_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['rival_id'];
          },
          {
            foreignKeyName: 'fase_equipo_equipo_id_fkey';
            columns: ['equipo_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['rival_id'];
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
      invitacion_gestor: {
        Row: {
          created_at: string;
          email: string;
          rol: Database['public']['Enums']['rol_usuario'];
        };
        Insert: {
          created_at?: string;
          email: string;
          rol: Database['public']['Enums']['rol_usuario'];
        };
        Update: {
          created_at?: string;
          email?: string;
          rol?: Database['public']['Enums']['rol_usuario'];
        };
        Relationships: [];
      };
      jugador: {
        Row: {
          created_at: string;
          id: string;
          lado_preferido: Database['public']['Enums']['lado'] | null;
          nombre_mostrar: string;
          sexo: Database['public']['Enums']['sexo'];
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          lado_preferido?: Database['public']['Enums']['lado'] | null;
          nombre_mostrar: string;
          sexo: Database['public']['Enums']['sexo'];
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          lado_preferido?: Database['public']['Enums']['lado'] | null;
          nombre_mostrar?: string;
          sexo?: Database['public']['Enums']['sexo'];
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
          jugador_id: string;
          lado: Database['public']['Enums']['lado'];
          partido_id: string;
        };
        Insert: {
          jugador_id: string;
          lado: Database['public']['Enums']['lado'];
          partido_id: string;
        };
        Update: {
          jugador_id?: string;
          lado?: Database['public']['Enums']['lado'];
          partido_id?: string;
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
            referencedRelation: 'estadistica_partido_equipo';
            referencedColumns: ['partido_id'];
          },
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['partido_id'];
          },
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido_resultado';
            referencedColumns: ['partido_id'];
          },
        ];
      };
      partido: {
        Row: {
          confrontacion_id: string;
          created_at: string;
          ganado: boolean | null;
          id: string;
          numero: number;
          pareja_rival: string | null;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          tipo: Database['public']['Enums']['tipo_partido'];
          updated_at: string;
        };
        Insert: {
          confrontacion_id: string;
          created_at?: string;
          ganado?: boolean | null;
          id?: string;
          numero: number;
          pareja_rival?: string | null;
          resultado?: Database['public']['Enums']['resultado_partido'] | null;
          tipo: Database['public']['Enums']['tipo_partido'];
          updated_at?: string;
        };
        Update: {
          confrontacion_id?: string;
          created_at?: string;
          ganado?: boolean | null;
          id?: string;
          numero?: number;
          pareja_rival?: string | null;
          resultado?: Database['public']['Enums']['resultado_partido'] | null;
          tipo?: Database['public']['Enums']['tipo_partido'];
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
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion_marcador';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_equipo';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['confrontacion_id'];
          },
        ];
      };
      perfil: {
        Row: {
          created_at: string;
          jugador_id: string | null;
          rol: Database['public']['Enums']['rol_usuario'];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          jugador_id?: string | null;
          rol: Database['public']['Enums']['rol_usuario'];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          jugador_id?: string | null;
          rol?: Database['public']['Enums']['rol_usuario'];
          updated_at?: string;
          user_id?: string;
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
          alta: string | null;
          baja: string | null;
          comodin: boolean;
          competicion_id: string;
          created_at: string;
          inscrito_oficial: boolean | null;
          jugador_id: string;
          updated_at: string;
        };
        Insert: {
          alta?: string | null;
          baja?: string | null;
          comodin?: boolean;
          competicion_id: string;
          created_at?: string;
          inscrito_oficial?: boolean | null;
          jugador_id: string;
          updated_at?: string;
        };
        Update: {
          alta?: string | null;
          baja?: string | null;
          comodin?: boolean;
          competicion_id?: string;
          created_at?: string;
          inscrito_oficial?: boolean | null;
          jugador_id?: string;
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
          juegos_nuestros: number;
          juegos_rival: number;
          numero: number;
          partido_id: string;
          tiebreak_nuestros: number | null;
          tiebreak_rival: number | null;
        };
        Insert: {
          juegos_nuestros: number;
          juegos_rival: number;
          numero: number;
          partido_id: string;
          tiebreak_nuestros?: number | null;
          tiebreak_rival?: number | null;
        };
        Update: {
          juegos_nuestros?: number;
          juegos_rival?: number;
          numero?: number;
          partido_id?: string;
          tiebreak_nuestros?: number | null;
          tiebreak_rival?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'set_partido_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_equipo';
            referencedColumns: ['partido_id'];
          },
          {
            foreignKeyName: 'set_partido_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['partido_id'];
          },
          {
            foreignKeyName: 'set_partido_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'set_partido_partido_id_fkey';
            columns: ['partido_id'];
            isOneToOne: false;
            referencedRelation: 'partido_resultado';
            referencedColumns: ['partido_id'];
          },
        ];
      };
    };
    Views: {
      confrontacion_marcador: {
        Row: {
          confrontacion_id: string | null;
          partidos_ganados: number | null;
          partidos_pendientes: number | null;
          partidos_perdidos: number | null;
        };
        Relationships: [];
      };
      estadistica_jornada: {
        Row: {
          competicion_id: string | null;
          condicion: string | null;
          confrontacion_id: string | null;
          fase_id: string | null;
          fase_nombre: string | null;
          fase_orden: number | null;
          fecha_hora: string | null;
          fecha_prevista: string | null;
          jornada: number | null;
          partidos_ganados: number | null;
          partidos_pendientes: number | null;
          partidos_perdidos: number | null;
          puntos: number | null;
          rival_id: string | null;
          rival_nombre: string | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_jugador: {
        Row: {
          comodin: boolean | null;
          competicion_id: string | null;
          fase_id: string | null;
          ganados: number | null;
          jornadas: number | null;
          juegos_ganados: number | null;
          juegos_perdidos: number | null;
          jugador_id: string | null;
          nombre_mostrar: string | null;
          partidos: number | null;
          perdidos: number | null;
          porcentaje_victorias: number | null;
          sets_ganados: number | null;
          sets_perdidos: number | null;
          toda_la_competicion: boolean | null;
          wo_a_favor: number | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_jugador_lado: {
        Row: {
          comodin: boolean | null;
          competicion_id: string | null;
          fase_id: string | null;
          ganados: number | null;
          jugador_id: string | null;
          lado: Database['public']['Enums']['lado'] | null;
          nombre_mostrar: string | null;
          partidos: number | null;
          perdidos: number | null;
          porcentaje_victorias: number | null;
          toda_la_competicion: boolean | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_jugador_puesto: {
        Row: {
          comodin: boolean | null;
          competicion_id: string | null;
          fase_id: string | null;
          ganados: number | null;
          jugador_id: string | null;
          nombre_mostrar: string | null;
          numero: number | null;
          partidos: number | null;
          perdidos: number | null;
          porcentaje_victorias: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
          toda_la_competicion: boolean | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_pareja: {
        Row: {
          competicion_id: string | null;
          fase_id: string | null;
          ganados: number | null;
          jugador_a_comodin: boolean | null;
          jugador_a_id: string | null;
          jugador_a_nombre: string | null;
          jugador_b_comodin: boolean | null;
          jugador_b_id: string | null;
          jugador_b_nombre: string | null;
          partidos: number | null;
          perdidos: number | null;
          porcentaje_victorias: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
          toda_la_competicion: boolean | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_a_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_b_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_participacion: {
        Row: {
          competicion_id: string | null;
          confrontaciones: number | null;
          disponible_sin_jugar: number | null;
          fase_id: string | null;
          jugadas: number | null;
          jugador_id: string | null;
          no_disponible: number | null;
          nombre_mostrar: string | null;
          porcentaje_jugadas: number | null;
          sin_responder: number | null;
          toda_la_competicion: boolean | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
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
      estadistica_partido_equipo: {
        Row: {
          competicion_id: string | null;
          condicion: string | null;
          confrontacion_id: string | null;
          es_wo: boolean | null;
          fase_id: string | null;
          fecha_prevista: string | null;
          ganado: boolean | null;
          jornada: number | null;
          juegos_ganados: number | null;
          juegos_perdidos: number | null;
          numero: number | null;
          partido_id: string | null;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          rival_nombre: string | null;
          sets_ganados: number | null;
          sets_jugados: number | null;
          sets_perdidos: number | null;
          tiebreaks_ganados: number | null;
          tiebreaks_jugados: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_partido_jugador: {
        Row: {
          comodin: boolean | null;
          companero_comodin: boolean | null;
          companero_id: string | null;
          companero_nombre: string | null;
          competicion_id: string | null;
          condicion: string | null;
          confrontacion_id: string | null;
          es_wo: boolean | null;
          fase_id: string | null;
          fecha_hora: string | null;
          fecha_prevista: string | null;
          ganado: boolean | null;
          jornada: number | null;
          juegos_ganados: number | null;
          juegos_perdidos: number | null;
          jugador_id: string | null;
          lado: Database['public']['Enums']['lado'] | null;
          marcador: string | null;
          nombre_mostrar: string | null;
          numero: number | null;
          partido_id: string | null;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          rival_id: string | null;
          rival_nombre: string | null;
          sets_ganados: number | null;
          sets_perdidos: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['companero_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'participacion_jugador_id_fkey';
            columns: ['jugador_id'];
            isOneToOne: false;
            referencedRelation: 'jugador';
            referencedColumns: ['id'];
          },
        ];
      };
      estadistica_puesto: {
        Row: {
          competicion_id: string | null;
          fase_id: string | null;
          ganados: number | null;
          numero: number | null;
          partidos: number | null;
          perdidos: number | null;
          porcentaje_victorias: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
          toda_la_competicion: boolean | null;
          wo_a_favor: number | null;
          wo_en_contra: number | null;
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
            foreignKeyName: 'fase_competicion_id_fkey';
            columns: ['competicion_id'];
            isOneToOne: false;
            referencedRelation: 'competicion';
            referencedColumns: ['id'];
          },
        ];
      };
      partido_resultado: {
        Row: {
          confrontacion_id: string | null;
          ganado: boolean | null;
          juegos_nuestros: number | null;
          juegos_rival: number | null;
          numero: number | null;
          partido_id: string | null;
          resultado: Database['public']['Enums']['resultado_partido'] | null;
          sets_nuestros: number | null;
          sets_rival: number | null;
          tipo: Database['public']['Enums']['tipo_partido'] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'confrontacion_marcador';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_jornada';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_equipo';
            referencedColumns: ['confrontacion_id'];
          },
          {
            foreignKeyName: 'partido_confrontacion_id_fkey';
            columns: ['confrontacion_id'];
            isOneToOne: false;
            referencedRelation: 'estadistica_partido_jugador';
            referencedColumns: ['confrontacion_id'];
          },
        ];
      };
    };
    Functions: {
      competicion_de_confrontacion: {
        Args: { p_confrontacion: string };
        Returns: string;
      };
      dar_permiso_gestor: {
        Args: {
          p_email: string;
          p_rol: Database['public']['Enums']['rol_usuario'];
        };
        Returns: undefined;
      };
      descartar_cuenta: { Args: { p_email: string }; Returns: undefined };
      es_admin: { Args: never; Returns: boolean };
      es_gestor: { Args: never; Returns: boolean };
      guardar_alineacion: {
        Args: { p_confrontacion: string; p_parejas: Json };
        Returns: undefined;
      };
      guardar_respuesta_encuesta: {
        Args: {
          p_confrontacion: string;
          p_jugador: string;
          p_respuesta?: Database['public']['Enums']['respuesta_encuesta'];
        };
        Returns: undefined;
      };
      guardar_resultado_partido: {
        Args: {
          p_confrontacion: string;
          p_ganado?: boolean;
          p_numero: number;
          p_resultado?: Database['public']['Enums']['resultado_partido'];
          p_sets: Json;
          p_tipo: Database['public']['Enums']['tipo_partido'];
        };
        Returns: string;
      };
      juega_nuestro_equipo: {
        Args: { p_confrontacion: string };
        Returns: boolean;
      };
      listar_cuentas_pendientes: {
        Args: never;
        Returns: {
          alta: string;
          email: string;
          nombre: string;
          ultimo_acceso: string;
        }[];
      };
      listar_gestores: {
        Args: never;
        Returns: {
          email: string;
          es_tu: boolean;
          nombre: string;
          pendiente: boolean;
          rol: Database['public']['Enums']['rol_usuario'];
        }[];
      };
      publicar_convocatoria: {
        Args: { p_confrontacion: string; p_publicada?: boolean };
        Returns: undefined;
      };
      quitar_permiso_gestor: { Args: { p_email: string }; Returns: undefined };
      reclamar_permiso_gestor: {
        Args: never;
        Returns: Database['public']['Enums']['rol_usuario'];
      };
      usuario_google_con_correo: { Args: { p_email: string }; Returns: string };
      validar_marcador: {
        Args: {
          p_ganado: boolean;
          p_resultado: Database['public']['Enums']['resultado_partido'];
          p_sets: Json;
        };
        Returns: undefined;
      };
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema['CompositeTypes'] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      estado_confrontacion: ['programada', 'aplazada', 'suspendida', 'jugada', 'no_comparecencia'],
      lado: ['reves', 'drive'],
      respuesta_encuesta: ['si', 'no'],
      resultado_partido: ['normal', 'wo_favor', 'wo_contra', 'abandono', 'suspendido'],
      rol_usuario: ['admin', 'capitan'],
      sexo: ['masculino', 'femenino'],
      tipo_fase: ['apertura', 'retos', 'clausura', 'previa_playoff', 'playoff', 'masters'],
      tipo_partido: ['masculino', 'femenino', 'mixto'],
    },
  },
} as const;
