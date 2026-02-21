export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          role: 'admin' | 'direction_campagne' | 'coordinateur_terrain' | 'responsable_quartier' | 'benevole';
          is_active: boolean;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          phone?: string | null;
          role?: 'admin' | 'direction_campagne' | 'coordinateur_terrain' | 'responsable_quartier' | 'benevole';
          is_active?: boolean;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'admin' | 'direction_campagne' | 'coordinateur_terrain' | 'responsable_quartier' | 'benevole';
          is_active?: boolean;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      quartiers: {
        Row: {
          id: string;
          name: string;
          geometry: Json;
          total_doors_estimate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          geometry: Json;
          total_doors_estimate?: number;
          created_at?: string;
        };
        Update: {
          name?: string;
          geometry?: Json;
          total_doors_estimate?: number;
        };
        Relationships: [];
      };
      sectors: {
        Row: {
          id: string;
          quartier_id: string;
          name: string;
          geometry: Json;
          estimated_doors: number;
          status: 'non_couvert' | 'partiellement_couvert' | 'couvert';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quartier_id: string;
          name: string;
          geometry: Json;
          estimated_doors?: number;
          status?: 'non_couvert' | 'partiellement_couvert' | 'couvert';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          quartier_id?: string;
          name?: string;
          geometry?: Json;
          estimated_doors?: number;
          status?: 'non_couvert' | 'partiellement_couvert' | 'couvert';
          updated_at?: string;
        };
        Relationships: [];
      };
      visits: {
        Row: {
          id: string;
          volunteer_id: string;
          sector_id: string | null;
          quartier_id: string;
          status: 'sympathisant' | 'indecis' | 'opposant' | 'absent';
          topic: string | null;
          comment: string | null;
          latitude: number | null;
          longitude: number | null;
          needs_followup: boolean;
          offline_id: string | null;
          created_at: string;
          contact_first_name: string | null;
          contact_last_name: string | null;
          contact_address: string | null;
          contact_phone: string | null;
          has_consent: boolean;
          household_voters: number | null;
          action_id: string | null;
          action_group_id: string | null;
        };
        Insert: {
          id?: string;
          volunteer_id: string;
          sector_id?: string | null;
          quartier_id: string;
          status: 'sympathisant' | 'indecis' | 'opposant' | 'absent';
          topic?: string | null;
          comment?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          needs_followup?: boolean;
          offline_id?: string | null;
          created_at?: string;
          contact_first_name?: string | null;
          contact_last_name?: string | null;
          contact_address?: string | null;
          contact_phone?: string | null;
          has_consent?: boolean;
          household_voters?: number | null;
          action_id?: string | null;
          action_group_id?: string | null;
        };
        Update: {
          volunteer_id?: string;
          sector_id?: string | null;
          quartier_id?: string;
          status?: 'sympathisant' | 'indecis' | 'opposant' | 'absent';
          topic?: string | null;
          comment?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          needs_followup?: boolean;
          offline_id?: string | null;
          contact_first_name?: string | null;
          contact_last_name?: string | null;
          contact_address?: string | null;
          contact_phone?: string | null;
          has_consent?: boolean;
          household_voters?: number | null;
          action_id?: string | null;
          action_group_id?: string | null;
        };
        Relationships: [];
      };
      sector_assignments: {
        Row: {
          id: string;
          sector_id: string;
          volunteer_id: string;
          assigned_by: string;
          assigned_at: string;
        };
        Insert: {
          id?: string;
          sector_id: string;
          volunteer_id: string;
          assigned_by: string;
          assigned_at?: string;
        };
        Update: {
          sector_id?: string;
          volunteer_id?: string;
          assigned_by?: string;
        };
        Relationships: [];
      };
      daily_actions: {
        Row: {
          id: string;
          name: string;
          quartier_id: string | null;
          geometry: Json;
          action_date: string;
          status: 'active' | 'completed' | 'cancelled';
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          quartier_id?: string | null;
          geometry: Json;
          action_date?: string;
          status?: 'active' | 'completed' | 'cancelled';
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          quartier_id?: string | null;
          geometry?: Json;
          action_date?: string;
          status?: 'active' | 'completed' | 'cancelled';
          notes?: string | null;
        };
        Relationships: [];
      };
      action_sectors: {
        Row: {
          id: string;
          action_id: string;
          name: string;
          geometry: Json;
          responsible_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action_id: string;
          name: string;
          geometry: Json;
          responsible_id?: string | null;
          created_at?: string;
        };
        Update: {
          action_id?: string;
          name?: string;
          geometry?: Json;
          responsible_id?: string | null;
        };
        Relationships: [];
      };
      action_groups: {
        Row: {
          id: string;
          action_sector_id: string;
          name: string;
          responsible_id: string | null;
          note_taker_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          action_sector_id: string;
          name: string;
          responsible_id?: string | null;
          note_taker_id?: string | null;
          created_at?: string;
        };
        Update: {
          action_sector_id?: string;
          name?: string;
          responsible_id?: string | null;
          note_taker_id?: string | null;
        };
        Relationships: [];
      };
      action_group_members: {
        Row: {
          id: string;
          group_id: string;
          volunteer_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          volunteer_id: string;
          created_at?: string;
        };
        Update: {
          group_id?: string;
          volunteer_id?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_global_kpis: {
        Args: Record<PropertyKey, never>;
        Returns: {
          total_doors_knocked: number;
          total_sympathisants: number;
          total_indecis: number;
          total_opposants: number;
          total_absents: number;
          support_rate: number;
          coverage_rate: number;
          sympathisant_indecis_ratio: number;
        }[];
      };
      get_quartier_stats: {
        Args: Record<PropertyKey, never>;
        Returns: {
          quartier_id: string;
          quartier_name: string;
          total_visits: number;
          sympathisants: number;
          indecis: number;
          opposants: number;
          absents: number;
          support_rate: number;
        }[];
      };
      get_top_topics: {
        Args: { limit_count: number };
        Returns: {
          topic: string;
          count: number;
        }[];
      };
      get_daily_visits: {
        Args: { days_back: number };
        Returns: {
          visit_date: string;
          count: number;
          sympathisants: number;
          indecis: number;
          opposants: number;
          absents: number;
        }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Quartier = Database['public']['Tables']['quartiers']['Row'];
export type Sector = Database['public']['Tables']['sectors']['Row'];
export type Visit = Database['public']['Tables']['visits']['Row'];
export type SectorAssignment = Database['public']['Tables']['sector_assignments']['Row'];
export type DailyAction = Database['public']['Tables']['daily_actions']['Row'];
export type ActionSector = Database['public']['Tables']['action_sectors']['Row'];
export type ActionGroup = Database['public']['Tables']['action_groups']['Row'];
export type ActionGroupMember = Database['public']['Tables']['action_group_members']['Row'];
