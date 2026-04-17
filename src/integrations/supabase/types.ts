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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          destination_category: string | null
          destination_id: string | null
          destination_min_discount: number | null
          destination_type: string
          id: string
          image_desktop: string | null
          image_mobile: string | null
          image_tablet: string | null
          is_active: boolean
          link: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination_category?: string | null
          destination_id?: string | null
          destination_min_discount?: number | null
          destination_type?: string
          id?: string
          image_desktop?: string | null
          image_mobile?: string | null
          image_tablet?: string | null
          is_active?: boolean
          link?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination_category?: string | null
          destination_id?: string | null
          destination_min_discount?: number | null
          destination_type?: string
          id?: string
          image_desktop?: string | null
          image_mobile?: string | null
          image_tablet?: string | null
          is_active?: boolean
          link?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      build_parts: {
        Row: {
          build_id: string
          created_at: string
          id: string
          offer_id: string
          quantity: number
          sort_order: number
        }
        Insert: {
          build_id: string
          created_at?: string
          id?: string
          offer_id: string
          quantity?: number
          sort_order?: number
        }
        Update: {
          build_id?: string
          created_at?: string
          id?: string
          offer_id?: string
          quantity?: number
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "build_parts_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "build_parts_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      build_performances: {
        Row: {
          build_id: string
          created_at: string
          fps: number
          game: string
          id: string
          quality: string
          sort_order: number
        }
        Insert: {
          build_id: string
          created_at?: string
          fps?: number
          game?: string
          id?: string
          quality?: string
          sort_order?: number
        }
        Update: {
          build_id?: string
          created_at?: string
          fps?: number
          game?: string
          id?: string
          quality?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "build_performances_build_id_fkey"
            columns: ["build_id"]
            isOneToOne: false
            referencedRelation: "builds"
            referencedColumns: ["id"]
          },
        ]
      }
      builds: {
        Row: {
          badge: string | null
          category: string
          created_at: string
          description: string | null
          discount_percentage: number | null
          final_price: number | null
          id: string
          image_url: string | null
          is_featured: boolean
          name: string
          status: string
          subtitle: string | null
          total_price: number | null
          updated_at: string
        }
        Insert: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name: string
          status?: string
          subtitle?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          badge?: string | null
          category?: string
          created_at?: string
          description?: string | null
          discount_percentage?: number | null
          final_price?: number | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name?: string
          status?: string
          subtitle?: string | null
          total_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      offers: {
        Row: {
          category: string
          created_at: string
          current_price: number | null
          discount_percentage: number | null
          external_url: string | null
          gallery: Json | null
          id: string
          image_url: string | null
          is_active: boolean
          is_best_price: boolean
          is_featured: boolean
          is_limited_offer: boolean
          is_reusable_in_builds: boolean
          is_visible: boolean
          listing_category: string
          long_description: string | null
          name: string
          old_price: number | null
          promo_badge: string | null
          short_description: string | null
          specs: Json | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          external_url?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_best_price?: boolean
          is_featured?: boolean
          is_limited_offer?: boolean
          is_reusable_in_builds?: boolean
          is_visible?: boolean
          listing_category?: string
          long_description?: string | null
          name: string
          old_price?: number | null
          promo_badge?: string | null
          short_description?: string | null
          specs?: Json | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          current_price?: number | null
          discount_percentage?: number | null
          external_url?: string | null
          gallery?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_best_price?: boolean
          is_featured?: boolean
          is_limited_offer?: boolean
          is_reusable_in_builds?: boolean
          is_visible?: boolean
          listing_category?: string
          long_description?: string | null
          name?: string
          old_price?: number | null
          promo_badge?: string | null
          short_description?: string | null
          specs?: Json | null
          updated_at?: string
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
