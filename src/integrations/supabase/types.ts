export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      certifications: {
        Row: {
          certification_name: string
          created_at: string
          credential_url: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_organization: string | null
          user_id: string
        }
        Insert: {
          certification_name: string
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          user_id: string
        }
        Update: {
          certification_name?: string
          created_at?: string
          credential_url?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_organization?: string | null
          user_id?: string
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          end_year: string | null
          id: string
          institution: string
          start_year: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          end_year?: string | null
          id?: string
          institution: string
          start_year?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          end_year?: string | null
          id?: string
          institution?: string
          start_year?: string | null
          user_id?: string
        }
        Relationships: []
      }
      languages: {
        Row: {
          created_at: string
          id: string
          language_name: string
          proficiency_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language_name: string
          proficiency_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language_name?: string
          proficiency_level?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          github: string | null
          id: string
          linkedin: string | null
          location: string | null
          personal_summary: string | null
          phone: string | null
          tone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          personal_summary?: string | null
          phone?: string | null
          tone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          github?: string | null
          id?: string
          linkedin?: string | null
          location?: string | null
          personal_summary?: string | null
          phone?: string | null
          tone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string | null
          created_at: string
          id: string
          proficiency_level: number | null
          skill_name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          proficiency_level?: number | null
          skill_name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          proficiency_level?: number | null
          skill_name?: string
          user_id?: string
        }
        Relationships: []
      }
      work_experience: {
        Row: {
          company: string
          created_at: string
          end_date: string | null
          id: string
          job_title: string
          location: string | null
          responsibilities: string[] | null
          start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company: string
          created_at?: string
          end_date?: string | null
          id?: string
          job_title: string
          location?: string | null
          responsibilities?: string[] | null
          start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string
          created_at?: string
          end_date?: string | null
          id?: string
          job_title?: string
          location?: string | null
          responsibilities?: string[] | null
          start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
