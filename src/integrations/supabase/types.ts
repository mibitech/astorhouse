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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      articles: {
        Row: {
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_info: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          mission: string | null
          name: string
          phone: string | null
          slogan: string | null
          social_media: Json | null
          updated_at: string
          values: string | null
          vision: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name?: string
          phone?: string | null
          slogan?: string | null
          social_media?: Json | null
          updated_at?: string
          values?: string | null
          vision?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          mission?: string | null
          name?: string
          phone?: string | null
          slogan?: string | null
          social_media?: Json | null
          updated_at?: string
          values?: string | null
          vision?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_type: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          contact_type?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          contact_type?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url: string
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      dogs: {
        Row: {
          achievements: string[] | null
          age: string
          birth_date: string
          breed: string
          color: string
          created_at: string
          description: string
          gender: string
          health_status: string
          height: number
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean
          is_available_for_breeding: boolean
          medical_records: Json | null
          microchip: string | null
          name: string
          notes: string | null
          offspring: string[] | null
          parents: Json | null
          pedigree: string | null
          price: number | null
          status: string
          temperament: string
          updated_at: string
          vaccination_status: string
          weight: number
        }
        Insert: {
          achievements?: string[] | null
          age: string
          birth_date: string
          breed: string
          color: string
          created_at?: string
          description: string
          gender: string
          health_status: string
          height: number
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          is_available_for_breeding?: boolean
          medical_records?: Json | null
          microchip?: string | null
          name: string
          notes?: string | null
          offspring?: string[] | null
          parents?: Json | null
          pedigree?: string | null
          price?: number | null
          status: string
          temperament: string
          updated_at?: string
          vaccination_status: string
          weight: number
        }
        Update: {
          achievements?: string[] | null
          age?: string
          birth_date?: string
          breed?: string
          color?: string
          created_at?: string
          description?: string
          gender?: string
          health_status?: string
          height?: number
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          is_available_for_breeding?: boolean
          medical_records?: Json | null
          microchip?: string | null
          name?: string
          notes?: string | null
          offspring?: string[] | null
          parents?: Json | null
          pedigree?: string | null
          price?: number | null
          status?: string
          temperament?: string
          updated_at?: string
          vaccination_status?: string
          weight?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          event_date: string | null
          id: string
          image_urls: string[] | null
          is_published: boolean | null
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          id?: string
          image_urls?: string[] | null
          is_published?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          answer: string
          category: string | null
          created_at: string
          id: string
          is_published: boolean | null
          order_index: number | null
          question: string
          source: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string
          id?: string
          is_published?: boolean | null
          order_index?: number | null
          question?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      glossary: {
        Row: {
          category: string | null
          created_at: string
          definition: string
          id: string
          term: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          definition: string
          id?: string
          term: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          definition?: string
          id?: string
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      hotel_packages: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      Leads: {
        Row: {
          created_at: string
          id_conversa: string
          nome: string | null
        }
        Insert: {
          created_at?: string
          id_conversa: string
          nome?: string | null
        }
        Update: {
          created_at?: string
          id_conversa?: string
          nome?: string | null
        }
        Relationships: []
      }
      n8n_chat_histories: {
        Row: {
          id: number
          message: Json
          session_id: string
        }
        Insert: {
          id?: number
          message: Json
          session_id: string
        }
        Update: {
          id?: number
          message?: Json
          session_id?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      puppies: {
        Row: {
          achievements: string[] | null
          age: string
          birth_date: string
          breed: string
          color: string
          created_at: string
          description: string
          gender: string
          health_status: string
          height: number
          id: string
          image_url: string | null
          images: string[] | null
          is_active: boolean
          is_available_for_sale: boolean
          medical_records: Json | null
          microchip: string | null
          name: string
          notes: string | null
          parents: Json | null
          pedigree: string | null
          price: number | null
          status: string
          temperament: string
          updated_at: string
          vaccination_status: string
          weight: number
        }
        Insert: {
          achievements?: string[] | null
          age: string
          birth_date: string
          breed: string
          color: string
          created_at?: string
          description: string
          gender: string
          health_status: string
          height: number
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          is_available_for_sale?: boolean
          medical_records?: Json | null
          microchip?: string | null
          name: string
          notes?: string | null
          parents?: Json | null
          pedigree?: string | null
          price?: number | null
          status: string
          temperament: string
          updated_at?: string
          vaccination_status: string
          weight: number
        }
        Update: {
          achievements?: string[] | null
          age?: string
          birth_date?: string
          breed?: string
          color?: string
          created_at?: string
          description?: string
          gender?: string
          health_status?: string
          height?: number
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_active?: boolean
          is_available_for_sale?: boolean
          medical_records?: Json | null
          microchip?: string | null
          name?: string
          notes?: string | null
          parents?: Json | null
          pedigree?: string | null
          price?: number | null
          status?: string
          temperament?: string
          updated_at?: string
          vaccination_status?: string
          weight?: number
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          photo_url: string | null
          position: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          photo_url?: string | null
          position: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          photo_url?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: { Args: never; Returns: string }
      is_admin: { Args: { user_id?: string }; Returns: boolean }
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
