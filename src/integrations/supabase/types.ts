export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      email_events: {
        Row: {
          email_send_id: string
          event_data: Json | null
          event_type: string
          id: string
          occurred_at: string
        }
        Insert: {
          email_send_id: string
          event_data?: Json | null
          event_type: string
          id?: string
          occurred_at?: string
        }
        Update: {
          email_send_id?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          occurred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_events_email_send_id_fkey"
            columns: ["email_send_id"]
            isOneToOne: false
            referencedRelation: "email_sends"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sends: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          lead_id: string
          resend_id: string | null
          sent_at: string | null
          sequence_id: string | null
          status: string
          step_id: string | null
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          lead_id: string
          resend_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          step_id?: string | null
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          lead_id?: string
          resend_id?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          step_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_sends_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_sends_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "email_sequence_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequence_steps: {
        Row: {
          content: string
          created_at: string
          delay_hours: number
          id: string
          sequence_id: string
          step_order: number
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          delay_hours?: number
          id?: string
          sequence_id: string
          step_order: number
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          delay_hours?: number
          id?: string
          sequence_id?: string
          step_order?: number
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_sequence_steps_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "email_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      email_sequences: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_event?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads: {
        Row: {
          close_status: string | null
          closed_at: string | null
          company: string
          created_at: string
          email: string
          id: string
          is_corporate_email: boolean
          lead_quality: string
          name: string
          notes: string | null
          phone: string | null
          pipeline_stage: string
          quiz_answers: Json | null
          quiz_level: string | null
          quiz_score: number | null
          role: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          close_status?: string | null
          closed_at?: string | null
          company: string
          created_at?: string
          email: string
          id?: string
          is_corporate_email?: boolean
          lead_quality?: string
          name: string
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string
          quiz_answers?: Json | null
          quiz_level?: string | null
          quiz_score?: number | null
          role: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          close_status?: string | null
          closed_at?: string | null
          company?: string
          created_at?: string
          email?: string
          id?: string
          is_corporate_email?: boolean
          lead_quality?: string
          name?: string
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string
          quiz_answers?: Json | null
          quiz_level?: string | null
          quiz_score?: number | null
          role?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      newsletter_contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string | null
          source: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string | null
          source?: string | null
          tags?: string[] | null
        }
        Relationships: []
      }
      newsletter_sends: {
        Row: {
          clicked_at: string | null
          created_at: string
          delivered_at: string | null
          id: string
          newsletter_id: string
          opened_at: string | null
          recipient_email: string
          recipient_name: string | null
          recipient_source: string
          resend_id: string | null
          sent_at: string | null
          status: string
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          newsletter_id: string
          opened_at?: string | null
          recipient_email: string
          recipient_name?: string | null
          recipient_source?: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Update: {
          clicked_at?: string | null
          created_at?: string
          delivered_at?: string | null
          id?: string
          newsletter_id?: string
          opened_at?: string | null
          recipient_email?: string
          recipient_name?: string | null
          recipient_source?: string
          resend_id?: string | null
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletters: {
        Row: {
          audience: string
          completed_at: string | null
          content: string
          created_at: string
          failed_count: number | null
          id: string
          sent_at: string | null
          sent_count: number | null
          status: string
          subject: string
          total_recipients: number | null
        }
        Insert: {
          audience?: string
          completed_at?: string | null
          content: string
          created_at?: string
          failed_count?: number | null
          id?: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject: string
          total_recipients?: number | null
        }
        Update: {
          audience?: string
          completed_at?: string | null
          content?: string
          created_at?: string
          failed_count?: number | null
          id?: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          subject?: string
          total_recipients?: number | null
        }
        Relationships: []
      }
      program_registrations: {
        Row: {
          course_objective: string | null
          email: string
          id: string
          linkedin_profile: string | null
          name: string
          paid_at: string | null
          payment_status: string | null
          phone: string
          registered_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          course_objective?: string | null
          email: string
          id?: string
          linkedin_profile?: string | null
          name: string
          paid_at?: string | null
          payment_status?: string | null
          phone: string
          registered_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          course_objective?: string | null
          email?: string
          id?: string
          linkedin_profile?: string | null
          name?: string
          paid_at?: string | null
          payment_status?: string | null
          phone?: string
          registered_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      webinar_registrations: {
        Row: {
          email: string
          email_sequence_step: number | null
          id: string
          last_email_sent_at: string | null
          name: string
          phone: string | null
          registered_at: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          email: string
          email_sequence_step?: number | null
          id?: string
          last_email_sent_at?: string | null
          name: string
          phone?: string | null
          registered_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          email?: string
          email_sequence_step?: number | null
          id?: string
          last_email_sent_at?: string | null
          name?: string
          phone?: string | null
          registered_at?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
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
