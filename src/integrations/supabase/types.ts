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
          generated_at: string | null
          id: string
          image_path: string | null
          incident_report_id: string | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          image_path?: string | null
          incident_report_id?: string | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          image_path?: string | null
          incident_report_id?: string | null
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
          tag_number: string | null
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
          tag_number?: string | null
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
          tag_number?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      equipment: {
        Row: {
          created_at: string | null
          equipment_number: string
          id: string
          last_inspection: string | null
          status: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          equipment_number: string
          id?: string
          last_inspection?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          equipment_number?: string
          id?: string
          last_inspection?: string | null
          status?: Database["public"]["Enums"]["equipment_status"] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      equipment_tracking: {
        Row: {
          engine_hours: number | null
          equipment_id: string
          fuel_level_percent: number | null
          id: string
          latitude: number
          longitude: number
          operation_state: Database["public"]["Enums"]["equipment_operation_state"]
          speed_mph: number | null
          timestamp: string
        }
        Insert: {
          engine_hours?: number | null
          equipment_id: string
          fuel_level_percent?: number | null
          id?: string
          latitude: number
          longitude: number
          operation_state: Database["public"]["Enums"]["equipment_operation_state"]
          speed_mph?: number | null
          timestamp?: string
        }
        Update: {
          engine_hours?: number | null
          equipment_id?: string
          fuel_level_percent?: number | null
          id?: string
          latitude?: number
          longitude?: number
          operation_state?: Database["public"]["Enums"]["equipment_operation_state"]
          speed_mph?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_tracking_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence_photos: {
        Row: {
          file_path: string | null
          id: string
          incident_report_id: string | null
          uploaded_at: string | null
        }
        Insert: {
          file_path?: string | null
          id?: string
          incident_report_id?: string | null
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string | null
          id?: string
          incident_report_id?: string | null
          uploaded_at?: string | null
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
      fingerprint_scans: {
        Row: {
          finger_position: string | null
          id: string
          incident_report_id: string | null
          scan_data: string | null
          scan_date: string | null
          scan_quality: number | null
        }
        Insert: {
          finger_position?: string | null
          id?: string
          incident_report_id?: string | null
          scan_data?: string | null
          scan_date?: string | null
          scan_quality?: number | null
        }
        Update: {
          finger_position?: string | null
          id?: string
          incident_report_id?: string | null
          scan_data?: string | null
          scan_date?: string | null
          scan_quality?: number | null
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
          evidence_property: Json | null
          id: string
          incident_date: string | null
          incident_description: string | null
          location_address: string | null
          location_details: string | null
          officer_name: string | null
          penal_code: string | null
          report_status: string | null
          suspect_details: Json | null
          vehicle_color: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_plate: string | null
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
          evidence_property?: Json | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_name?: string | null
          penal_code?: string | null
          report_status?: string | null
          suspect_details?: Json | null
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
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
          evidence_property?: Json | null
          id?: string
          incident_date?: string | null
          incident_description?: string | null
          location_address?: string | null
          location_details?: string | null
          officer_name?: string | null
          penal_code?: string | null
          report_status?: string | null
          suspect_details?: Json | null
          vehicle_color?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_plate?: string | null
          vehicle_vin?: string | null
          vehicle_year?: string | null
          victim_details?: Json | null
        }
        Relationships: []
      }
      learning_strategies: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          implementation_steps: Json
          is_premium: boolean | null
          subjects: string[]
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          implementation_steps: Json
          is_premium?: boolean | null
          subjects: string[]
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          implementation_steps?: Json
          is_premium?: boolean | null
          subjects?: string[]
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      minor_data_access_logs: {
        Row: {
          access_reason: string
          access_type: string
          accessed_at: string
          accessed_by_user_id: string | null
          id: string
          ip_address: string | null
          student_id: string | null
          user_agent: string | null
        }
        Insert: {
          access_reason: string
          access_type: string
          accessed_at?: string
          accessed_by_user_id?: string | null
          id?: string
          ip_address?: string | null
          student_id?: string | null
          user_agent?: string | null
        }
        Update: {
          access_reason?: string
          access_type?: string
          accessed_at?: string
          accessed_by_user_id?: string | null
          id?: string
          ip_address?: string | null
          student_id?: string | null
          user_agent?: string | null
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
      report_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      safety_check_items: {
        Row: {
          created_at: string | null
          id: string
          item_name: string
          notes: string | null
          photo_url: string | null
          safety_check_id: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_name: string
          notes?: string | null
          photo_url?: string | null
          safety_check_id?: string | null
          status: string
        }
        Update: {
          created_at?: string | null
          id?: string
          item_name?: string
          notes?: string | null
          photo_url?: string | null
          safety_check_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_check_items_safety_check_id_fkey"
            columns: ["safety_check_id"]
            isOneToOne: false
            referencedRelation: "safety_checks"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_checks: {
        Row: {
          check_type: string
          completed_at: string | null
          created_at: string | null
          equipment_id: string | null
          id: string
          notes: string | null
          operator_id: string | null
          status: string
        }
        Insert: {
          check_type: string
          completed_at?: string | null
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          operator_id?: string | null
          status: string
        }
        Update: {
          check_type?: string
          completed_at?: string | null
          created_at?: string | null
          equipment_id?: string | null
          id?: string
          notes?: string | null
          operator_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_checks_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_usage: {
        Row: {
          id: string
          notes: string | null
          rating: number | null
          strategy_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          rating?: number | null
          strategy_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          rating?: number | null
          strategy_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategy_usage_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "learning_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      student_data_protection: {
        Row: {
          created_at: string
          data_access_restrictions: string[] | null
          data_retention_policy: string
          guardian_email: string | null
          id: string
          parental_consent_date: string | null
          parental_consent_obtained: boolean | null
          school_district: string | null
          school_email: string | null
          school_system: Database["public"]["Enums"]["school_system"] | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          data_access_restrictions?: string[] | null
          data_retention_policy?: string
          guardian_email?: string | null
          id?: string
          parental_consent_date?: string | null
          parental_consent_obtained?: boolean | null
          school_district?: string | null
          school_email?: string | null
          school_system?: Database["public"]["Enums"]["school_system"] | null
          updated_at?: string
          user_id: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          data_access_restrictions?: string[] | null
          data_retention_policy?: string
          guardian_email?: string | null
          id?: string
          parental_consent_date?: string | null
          parental_consent_obtained?: boolean | null
          school_district?: string | null
          school_email?: string | null
          school_system?: Database["public"]["Enums"]["school_system"] | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      student_profiles: {
        Row: {
          created_at: string
          id: string
          legal_disclaimer_accepted: boolean | null
          legal_disclaimer_date: string | null
          school_name: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          legal_disclaimer_accepted?: boolean | null
          legal_disclaimer_date?: string | null
          school_name: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          legal_disclaimer_accepted?: boolean | null
          legal_disclaimer_date?: string | null
          school_name?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          features: Json
          id: string
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          features: Json
          id?: string
          name: string
          price: number
        }
        Update: {
          created_at?: string
          features?: Json
          id?: string
          name?: string
          price?: number
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
      teacher_profiles: {
        Row: {
          created_at: string
          full_name: string | null
          grade_level: string | null
          id: string
          school_name: string | null
          subject_area: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          grade_level?: string | null
          id: string
          school_name?: string | null
          subject_area?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          grade_level?: string | null
          id?: string
          school_name?: string | null
          subject_area?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      template_sections: {
        Row: {
          created_at: string
          description: string | null
          guidance_notes: string | null
          id: string
          order_index: number
          required_fields: string[] | null
          section_type: Database["public"]["Enums"]["template_section_type"]
          template_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          guidance_notes?: string | null
          id?: string
          order_index: number
          required_fields?: string[] | null
          section_type: Database["public"]["Enums"]["template_section_type"]
          template_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          guidance_notes?: string | null
          id?: string
          order_index?: number
          required_fields?: string[] | null
          section_type?: Database["public"]["Enums"]["template_section_type"]
          template_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_sections_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "report_templates"
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
    }
    Views: {
      subscription_tiers: {
        Row: {
          ai_features: boolean | null
          gps_tracking_enabled: boolean | null
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
          can_use_gps_tracking: boolean
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
      is_minor: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      log_minor_data_access: {
        Args: {
          p_student_id: string
          p_access_type: string
          p_access_reason: string
        }
        Returns: undefined
      }
      search_property: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          type: string
          description: string
          serial_number: string
          owner: string
          status: string
        }[]
      }
      search_vehicles: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          make: string
          model: string
          year: string
          vin: string
          plate: string
          owner: string
        }[]
      }
      search_warrants: {
        Args: {
          search_term: string
        }
        Returns: {
          id: string
          suspect_name: string
          warrant_type: string
          issue_date: string
          status: string
          case_number: string
          correlation_score: number
        }[]
      }
    }
    Enums: {
      equipment_operation_state: "running" | "idle" | "off"
      equipment_status:
        | "available"
        | "in_use"
        | "maintenance_needed"
        | "out_of_service"
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
      school_system: "google_edu" | "microsoft_edu" | "other"
      school_system_type: "google_edu" | "microsoft_edu" | "other"
      subscription_tier:
        | "free"
        | "basic"
        | "professional"
        | "premium"
        | "enterprise"
      template_section_type:
        | "incident"
        | "vehicle"
        | "location"
        | "evidence"
        | "emergency"
        | "victim"
        | "suspect"
        | "photos"
      user_role: "viewer" | "user" | "admin"
      user_type: "adult" | "minor"
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
