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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          image: string
          is_active: boolean
          link: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image: string
          is_active?: boolean
          link?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image?: string
          is_active?: boolean
          link?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          content: string
          created_at: string
          display_order: number
          excerpt: string | null
          id: string
          image: string
          is_published: boolean
          slug: string
          title: string
          meta_title: string | null
          meta_description: string | null
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          display_order?: number
          excerpt?: string | null
          id?: string
          image: string
          is_published?: boolean
          slug: string
          title: string
          meta_title?: string | null
          meta_description?: string | null
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          display_order?: number
          excerpt?: string | null
          id?: string
          image?: string
          is_published?: boolean
          slug?: string
          title?: string
          meta_title?: string | null
          meta_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_campaigns: {
        Row: {
          content: string
          created_at: string
          id: string
          recipients_count: number | null
          sent_at: string | null
          status: string
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          recipients_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          recipients_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          is_active: boolean
          subscribed_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          subscribed_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_city: string
          customer_country: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone: string | null
          customer_postal_code: string
          discount_amount: number | null
          discount_code: string | null
          id: string
          items: Json
          order_date: string
          order_id: string
          payment_info: Json | null
          shipping_name: string | null
          shipping_price: number | null
          status: string
          subtotal: number
          tax: number | null
          total: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_city: string
          customer_country: string
          customer_email: string
          customer_first_name: string
          customer_last_name: string
          customer_phone?: string | null
          customer_postal_code: string
          discount_amount?: number | null
          discount_code?: string | null
          id?: string
          items: Json
          order_date?: string
          order_id: string
          payment_info?: Json | null
          shipping_name?: string | null
          shipping_price?: number | null
          status?: string
          subtotal: number
          tax?: number | null
          total: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_city?: string
          customer_country?: string
          customer_email?: string
          customer_first_name?: string
          customer_last_name?: string
          customer_phone?: string | null
          customer_postal_code?: string
          discount_amount?: number | null
          discount_code?: string | null
          id?: string
          items?: Json
          order_date?: string
          order_id?: string
          payment_info?: Json | null
          shipping_name?: string | null
          shipping_price?: number | null
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          benefits: Json | null
          category: string
          created_at: string | null
          description: string | null
          id: number
          image: string
          images: Json | null
          ingredients: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          og_image: string | null
          price: number
          sku: string | null
          slug: string
          status: string | null
          tags: Json | null
          updated_at: string | null
          usage: string | null
          education_content: Json | null
          clinical_results: Json | null
          faqs: Json | null
          ugc_videos: Json | null
        }
        Insert: {
          benefits?: Json | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: number
          image: string
          images?: Json | null
          ingredients?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          og_image?: string | null
          price: number
          sku?: string | null
          slug: string
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
          usage?: string | null
          education_content?: Json | null
          clinical_results?: Json | null
          faqs?: Json | null
          ugc_videos?: Json | null
        }
        Update: {
          benefits?: Json | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: number
          image?: string
          images?: Json | null
          ingredients?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          og_image?: string | null
          price?: number
          sku?: string | null
          slug?: string
          status?: string | null
          tags?: Json | null
          updated_at?: string | null
          usage?: string | null
          education_content?: Json | null
          clinical_results?: Json | null
          faqs?: Json | null
          ugc_videos?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string
          discount_percentage: number
          id: string
          is_active: boolean
          max_usage_count: number | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          code: string
          created_at?: string
          discount_percentage: number
          id?: string
          is_active?: boolean
          max_usage_count?: number | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          code?: string
          created_at?: string
          discount_percentage?: number
          id?: string
          is_active?: boolean
          max_usage_count?: number | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string | null
          date: string | null
          email: string | null
          id: string
          image_urls: Json | null
          name: string
          product_id: number | null
          rating: number
          text: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          email?: string | null
          id?: string
          image_urls?: Json | null
          name: string
          product_id?: number | null
          rating: number
          text: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          email?: string | null
          id?: string
          image_urls?: Json | null
          name?: string
          product_id?: number | null
          rating?: number
          text?: string
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
