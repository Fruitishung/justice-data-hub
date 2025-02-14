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
      access_logs: {
        Row: {
          allowed: boolean
          feature: string
          id: string
          ip_address: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          allowed: boolean
          feature: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          allowed?: boolean
          feature?: string
          id?: string
          ip_address?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_crime_scene_photos: {
        Row: {
          created_at: string
          id: string
          image_path: string
          incident_report_id: string | null
          penal_code: Database["public"]["Enums"]["penal_code_type"]
          prompt_used: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_path: string
          incident_report_id?: string | null
          penal_code: Database["public"]["Enums"]["penal_code_type"]
          prompt_used: string
        }
        Update: {
          created_at?: string
          id?: string
          image_path?: string
          incident_report_id?: string | null
          penal_code?: Database["public"]["Enums"]["penal_code_type"]
          prompt_used?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_crime_scene_photos_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      arrest_tags: {
        Row: {
          arresting_officer: string | null
          booking_date: string | null
          charges: string | null
          created_at: string | null
          id: string
          incident_report_id: string | null
          mugshot_url: string | null
          processing_status: string | null
          suspect_name: string | null
          tag_number: string
          updated_at: string | null
        }
        Insert: {
          arresting_officer?: string | null
          booking_date?: string | null
          charges?: string | null
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          mugshot_url?: string | null
          processing_status?: string | null
          suspect_name?: string | null
          tag_number: string
          updated_at?: string | null
        }
        Update: {
          arresting_officer?: string | null
          booking_date?: string | null
          charges?: string | null
          created_at?: string | null
          id?: string
          incident_report_id?: string | null
          mugshot_url?: string | null
          processing_status?: string | null
          suspect_name?: string | null
          tag_number?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arrest_tags_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      crime_scene_photos: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          id: string
          incident_report_id: string
          taken_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          id?: string
          incident_report_id: string
          taken_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          id?: string
          incident_report_id?: string
          taken_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crime_scene_photos_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
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
      evidence_photos: {
        Row: {
          created_at: string | null
          description: string | null
          file_path: string
          id: string
          incident_report_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          file_path: string
          id?: string
          incident_report_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          file_path?: string
          id?: string
          incident_report_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "evidence_photos_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      fingerprint_matches: {
        Row: {
          id: string
          matched_at: string | null
          matched_scan_id: string | null
          scan_id: string | null
          similarity_score: number
        }
        Insert: {
          id?: string
          matched_at?: string | null
          matched_scan_id?: string | null
          scan_id?: string | null
          similarity_score: number
        }
        Update: {
          id?: string
          matched_at?: string | null
          matched_scan_id?: string | null
          scan_id?: string | null
          similarity_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "fingerprint_matches_matched_scan_id_fkey"
            columns: ["matched_scan_id"]
            isOneToOne: false
            referencedRelation: "fingerprint_scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fingerprint_matches_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "fingerprint_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      fingerprint_patterns: {
        Row: {
          base_template: string
          created_at: string | null
          id: string
          pattern_name: string
        }
        Insert: {
          base_template: string
          created_at?: string | null
          id?: string
          pattern_name: string
        }
        Update: {
          base_template?: string
          created_at?: string | null
          id?: string
          pattern_name?: string
        }
        Relationships: []
      }
      fingerprint_scans: {
        Row: {
          created_at: string | null
          finger_position: string
          id: string
          image_path: string | null
          incident_report_id: string | null
          minutiae_points: Json | null
          pattern_type: string | null
          ridge_count: number | null
          scan_data: string
          scan_date: string | null
          scan_quality: number | null
          whorl_pattern: string | null
        }
        Insert: {
          created_at?: string | null
          finger_position: string
          id?: string
          image_path?: string | null
          incident_report_id?: string | null
          minutiae_points?: Json | null
          pattern_type?: string | null
          ridge_count?: number | null
          scan_data: string
          scan_date?: string | null
          scan_quality?: number | null
          whorl_pattern?: string | null
        }
        Update: {
          created_at?: string | null
          finger_position?: string
          id?: string
          image_path?: string | null
          incident_report_id?: string | null
          minutiae_points?: Json | null
          pattern_type?: string | null
          ridge_count?: number | null
          scan_data?: string
          scan_date?: string | null
          scan_quality?: number | null
          whorl_pattern?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fingerprint_scans_incident_report_id_fkey"
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
          evidence_photos: Json | null
          evidence_property: Json | null
          id: string
          incident_date: string | null
          incident_description: string | null
          location_address: string | null
          location_details: string | null
          officer_badge_number: string | null
          officer_name: string | null
          officer_rank: string | null
          penal_code: Database["public"]["Enums"]["penal_code_type"] | null
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
          evidence_photos?: Json | null
          evidence_property?: Json | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_badge_number?: string | null
          officer_name?: string | null
          officer_rank?: string | null
          penal_code?: Database["public"]["Enums"]["penal_code_type"] | null
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
          evidence_photos?: Json | null
          evidence_property?: Json | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_badge_number?: string | null
          officer_name?: string | null
          officer_rank?: string | null
          penal_code?: Database["public"]["Enums"]["penal_code_type"] | null
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
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string
          id: string
          payment_type: string
          status: string
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_type: string
          status: string
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string
          id?: string
          payment_type?: string
          status?: string
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      penal_codes: {
        Row: {
          code: Database["public"]["Enums"]["penal_code_type"]
          created_at: string
          description: string
          id: string
        }
        Insert: {
          code: Database["public"]["Enums"]["penal_code_type"]
          created_at?: string
          description: string
          id?: string
        }
        Update: {
          code?: Database["public"]["Enums"]["penal_code_type"]
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: []
      }
      property_records: {
        Row: {
          created_at: string | null
          date_reported: string | null
          description: string | null
          id: string
          last_updated: string | null
          make: string | null
          model: string | null
          owner_address: string | null
          owner_name: string | null
          property_type: string
          recovered_date: string | null
          recovery_location: string | null
          serial_number: string | null
          stolen_status: boolean | null
        }
        Insert: {
          created_at?: string | null
          date_reported?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          make?: string | null
          model?: string | null
          owner_address?: string | null
          owner_name?: string | null
          property_type: string
          recovered_date?: string | null
          recovery_location?: string | null
          serial_number?: string | null
          stolen_status?: boolean | null
        }
        Update: {
          created_at?: string | null
          date_reported?: string | null
          description?: string | null
          id?: string
          last_updated?: string | null
          make?: string | null
          model?: string | null
          owner_address?: string | null
          owner_name?: string | null
          property_type?: string
          recovered_date?: string | null
          recovery_location?: string | null
          serial_number?: string | null
          stolen_status?: boolean | null
        }
        Relationships: []
      }
      report_credits: {
        Row: {
          created_at: string | null
          credits_remaining: number
          credits_used: number
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          credits_remaining?: number
          credits_used?: number
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          credits_remaining?: number
          credits_used?: number
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string
          current_period_start: string
          id: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end: string
          current_period_start: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string
          current_period_start?: string
          id?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      suspect_biometrics: {
        Row: {
          created_at: string | null
          fingerprint_classification: string | null
          hand_dominance: string | null
          id: string
          incident_report_id: string | null
          palm_print_data: Json | null
          suspect_name: string
        }
        Insert: {
          created_at?: string | null
          fingerprint_classification?: string | null
          hand_dominance?: string | null
          id?: string
          incident_report_id?: string | null
          palm_print_data?: Json | null
          suspect_name: string
        }
        Update: {
          created_at?: string | null
          fingerprint_classification?: string | null
          hand_dominance?: string | null
          id?: string
          incident_report_id?: string | null
          palm_print_data?: Json | null
          suspect_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "suspect_biometrics_incident_report_id_fkey"
            columns: ["incident_report_id"]
            isOneToOne: false
            referencedRelation: "incident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          allowed_features: string[] | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allowed_features?: string[] | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allowed_features?: string[] | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vehicle_records: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          insurance_status: string | null
          last_updated: string | null
          make: string | null
          model: string | null
          owner_address: string | null
          owner_name: string | null
          plate_number: string | null
          registration_status: string | null
          state: string | null
          stolen_status: boolean | null
          vin: string | null
          year: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          insurance_status?: string | null
          last_updated?: string | null
          make?: string | null
          model?: string | null
          owner_address?: string | null
          owner_name?: string | null
          plate_number?: string | null
          registration_status?: string | null
          state?: string | null
          stolen_status?: boolean | null
          vin?: string | null
          year?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          insurance_status?: string | null
          last_updated?: string | null
          make?: string | null
          model?: string | null
          owner_address?: string | null
          owner_name?: string | null
          plate_number?: string | null
          registration_status?: string | null
          state?: string | null
          stolen_status?: boolean | null
          vin?: string | null
          year?: number | null
        }
        Relationships: []
      }
      warrants: {
        Row: {
          created_at: string | null
          date_issued: string | null
          details: Json | null
          expiration_date: string | null
          id: string
          issuing_agency: string
          status: Database["public"]["Enums"]["warrant_status"] | null
          subject_name: string
          updated_at: string | null
          warrant_number: string
          warrant_type: string
        }
        Insert: {
          created_at?: string | null
          date_issued?: string | null
          details?: Json | null
          expiration_date?: string | null
          id?: string
          issuing_agency: string
          status?: Database["public"]["Enums"]["warrant_status"] | null
          subject_name: string
          updated_at?: string | null
          warrant_number: string
          warrant_type: string
        }
        Update: {
          created_at?: string | null
          date_issued?: string | null
          details?: Json | null
          expiration_date?: string | null
          id?: string
          issuing_agency?: string
          status?: Database["public"]["Enums"]["warrant_status"] | null
          subject_name?: string
          updated_at?: string | null
          warrant_number?: string
          warrant_type?: string
        }
        Relationships: []
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
      subscription_tiers: {
        Row: {
          ai_features: boolean | null
          description: string | null
          monthly_price: number | null
          photo_upload: boolean | null
          reports_per_month: number | null
          tier: Database["public"]["Enums"]["subscription_tier"] | null
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
      check_user_tier_permissions: {
        Args: {
          user_id: string
        }
        Returns: {
          can_create_reports: boolean
          max_reports_per_month: number
          can_upload_photos: boolean
          can_use_ai_features: boolean
          remaining_credits: number
        }[]
      }
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
      has_feature_access: {
        Args: {
          feature_name: string
        }
        Returns: boolean
      }
      search_property: {
        Args: {
          search_term: string
          include_stolen_only?: boolean
        }
        Returns: {
          created_at: string | null
          date_reported: string | null
          description: string | null
          id: string
          last_updated: string | null
          make: string | null
          model: string | null
          owner_address: string | null
          owner_name: string | null
          property_type: string
          recovered_date: string | null
          recovery_location: string | null
          serial_number: string | null
          stolen_status: boolean | null
        }[]
      }
      search_vehicles: {
        Args: {
          search_term: string
          include_stolen_only?: boolean
        }
        Returns: {
          color: string | null
          created_at: string | null
          id: string
          insurance_status: string | null
          last_updated: string | null
          make: string | null
          model: string | null
          owner_address: string | null
          owner_name: string | null
          plate_number: string | null
          registration_status: string | null
          state: string | null
          stolen_status: boolean | null
          vin: string | null
          year: number | null
        }[]
      }
      search_warrants: {
        Args: {
          search_term: string
          warrant_status?: Database["public"]["Enums"]["warrant_status"]
        }
        Returns: {
          created_at: string | null
          date_issued: string | null
          details: Json | null
          expiration_date: string | null
          id: string
          issuing_agency: string
          status: Database["public"]["Enums"]["warrant_status"] | null
          subject_name: string
          updated_at: string | null
          warrant_number: string
          warrant_type: string
        }[]
      }
    }
    Enums: {
      finger_position:
        | "right_thumb"
        | "right_index"
        | "right_middle"
        | "right_ring"
        | "right_little"
        | "left_thumb"
        | "left_index"
        | "left_middle"
        | "left_ring"
        | "left_little"
      penal_code_type: "211" | "187"
      subscription_tier: "free" | "basic" | "professional" | "enterprise"
      user_role: "viewer" | "user" | "admin"
      warrant_status: "active" | "cleared" | "expired"
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
