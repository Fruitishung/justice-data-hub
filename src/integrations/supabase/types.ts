export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      data_analysis_training: {
        Row: {
          analysis_metrics: Json | null
          analysis_type: string
          completed_at: string | null
          completion_status: string | null
          created_at: string | null
          id: string
          incident_report_id: string | null
          training_module: string
          training_notes: string | null
        }
        Insert: {
          analysis_metrics?: Json | null
          analysis_type: string
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          training_module: string
          training_notes?: string | null
        }
        Update: {
          analysis_metrics?: Json | null
          analysis_type?: string
          completed_at?: string | null
          completion_status?: string | null
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          training_module?: string
          training_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_analysis_training_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          case_number: string | null
          created_at: string | null
          emergency_response: string | null
          emergency_units: string | null
          evidence_description: string | null
          evidence_location: string | null
          id: string
          incident_date: string | null
          incident_description: string | null
          location_address: string | null
          location_details: string | null
          officer_badge_number: string | null
          officer_name: string | null
          officer_rank: string | null
          person_description: string | null
          person_name: string | null
          report_category: string | null
          report_priority: string | null
          report_resolution: string | null
          report_status: string | null
          report_type: string | null
          resolution_date: string | null
          suspect_details: Json | null
          vehicle_color: string | null
          vehicle_crime_involvement: Json | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
          vehicle_towing_authority: Json | null
          vehicle_vin: string | null
          vehicle_year: string | null
          victim_details: Json | null
        }
        Insert: {
          case_number?: string | null
          created_at?: string | null
          emergency_response?: string | null
          emergency_units?: string | null
          evidence_description?: string | null
          evidence_location?: string | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_badge_number?: string | null
          officer_name?: string | null
          officer_rank?: string | null
          person_description?: string | null
          person_name?: string | null
          report_category?: string | null
          report_priority?: string | null
          report_resolution?: string | null
          report_status?: string | null
          report_type?: string | null
          resolution_date?: string | null
          suspect_details?: Json | null
          vehicle_color?: string | null
          vehicle_crime_involvement?: Json | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_towing_authority?: Json | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
          victim_details?: Json | null
        }
        Update: {
          case_number?: string | null
          created_at?: string | null
          emergency_response?: string | null
          emergency_units?: string | null
          evidence_description?: string | null
          evidence_location?: string | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_badge_number?: string | null
          officer_name?: string | null
          officer_rank?: string | null
          person_description?: string | null
          person_name?: string | null
          report_category?: string | null
          report_priority?: string | null
          report_resolution?: string | null
          report_status?: string | null
          report_type?: string | null
          resolution_date?: string | null
          suspect_details?: Json | null
          vehicle_color?: string | null
          vehicle_crime_involvement?: Json | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_towing_authority?: Json | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
          victim_details?: Json | null
        }
        Relationships: []
      }
      narrative_reports: {
        Row: {
          created_at: string | null
          id: string
          incident_report_id: string | null
          narrative_text: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          narrative_text?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          narrative_text?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "narrative_reports_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      report_analytics: {
        Row: {
          month: number | null
          report_category: string | null
          report_count: number | null
          report_priority: string | null
          report_status: string | null
          report_type: string | null
          year: number | null
        }
        Relationships: []
      }
      training_analytics: {
        Row: {
          analysis_type: string | null
          avg_completion_time_seconds: number | null
          completed_cases: number | null
          completion_status: string | null
          total_cases: number | null
          training_module: string | null
          unique_cases: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_report_counts: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          report_type: string
          total_count: number
          open_count: number
          closed_count: number
        }[]
      }
      get_training_metrics: {
        Args: {
          start_date?: string
          end_date?: string
        }
        Returns: {
          training_module: string
          total_entries: number
          completed_entries: number
          completion_rate: number
          avg_completion_time_hours: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
