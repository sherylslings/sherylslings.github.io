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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      booking_requests: {
        Row: {
          agreed_to_terms: boolean
          carrier_id: string
          city: string
          created_at: string
          customer_name: string
          duration: string
          id: string
          notes: string | null
          phone: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          agreed_to_terms?: boolean
          carrier_id: string
          city: string
          created_at?: string
          customer_name: string
          duration: string
          id?: string
          notes?: string | null
          phone: string
          start_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          agreed_to_terms?: boolean
          carrier_id?: string
          city?: string
          created_at?: string
          customer_name?: string
          duration?: string
          id?: string
          notes?: string | null
          phone?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          age_range: string
          availability_status: string
          brand_name: string
          buyout_price: number
          carry_positions: string[]
          category: string
          condition: string
          created_at: string
          description: string | null
          id: string
          images: string[]
          laundry_instructions: string | null
          model_name: string
          monthly_rent: number
          next_available_date: string | null
          refundable_deposit: number
          updated_at: string
          weekly_rent: number
          weight_range: string
        }
        Insert: {
          age_range: string
          availability_status?: string
          brand_name: string
          buyout_price: number
          carry_positions?: string[]
          category: string
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          laundry_instructions?: string | null
          model_name: string
          monthly_rent: number
          next_available_date?: string | null
          refundable_deposit: number
          updated_at?: string
          weekly_rent: number
          weight_range: string
        }
        Update: {
          age_range?: string
          availability_status?: string
          brand_name?: string
          buyout_price?: number
          carry_positions?: string[]
          category?: string
          condition?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: string[]
          laundry_instructions?: string | null
          model_name?: string
          monthly_rent?: number
          next_available_date?: string | null
          refundable_deposit?: number
          updated_at?: string
          weekly_rent?: number
          weight_range?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          accent_color: string
          background_color: string
          brand_name: string
          categories_subtitle: string | null
          categories_title: string | null
          created_at: string
          email: string | null
          features: Json | null
          footer_description: string | null
          footer_links: Json | null
          foreground_color: string
          hero_cta_link: string | null
          hero_cta_text: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string
          how_it_works_steps: Json | null
          how_it_works_title: string | null
          id: string
          instagram_url: string | null
          logo_url: string | null
          menu_items: Json | null
          meta_description: string | null
          meta_title: string | null
          policy_content: string | null
          primary_color: string
          safety_content: string | null
          secondary_color: string
          tagline: string | null
          updated_at: string
          whatsapp_message: string | null
          whatsapp_number: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          brand_name?: string
          categories_subtitle?: string | null
          categories_title?: string | null
          created_at?: string
          email?: string | null
          features?: Json | null
          footer_description?: string | null
          footer_links?: Json | null
          foreground_color?: string
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string
          how_it_works_steps?: Json | null
          how_it_works_title?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          menu_items?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          policy_content?: string | null
          primary_color?: string
          safety_content?: string | null
          secondary_color?: string
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
          whatsapp_number?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          brand_name?: string
          categories_subtitle?: string | null
          categories_title?: string | null
          created_at?: string
          email?: string | null
          features?: Json | null
          footer_description?: string | null
          footer_links?: Json | null
          foreground_color?: string
          hero_cta_link?: string | null
          hero_cta_text?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string
          how_it_works_steps?: Json | null
          how_it_works_title?: string | null
          id?: string
          instagram_url?: string | null
          logo_url?: string | null
          menu_items?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          policy_content?: string | null
          primary_color?: string
          safety_content?: string | null
          secondary_color?: string
          tagline?: string | null
          updated_at?: string
          whatsapp_message?: string | null
          whatsapp_number?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
