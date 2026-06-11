// Auto-generated types — regenerate with: npx supabase gen types typescript --project-id <project-id>
// Or run: npx supabase gen types typescript --local > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          phone: string | null
          date_of_birth: string | null
          membership_tier: 'bronze' | 'silver' | 'gold'
          total_orders: number
          total_spent: number
          free_shipping_used: number
          free_shipping_month: string
          first_order_discount_used: boolean
          birthday_offer_used: string | null
          referral_code: string | null
          referral_count: number
          referred_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          phone?: string | null
          date_of_birth?: string | null
          membership_tier?: 'bronze' | 'silver' | 'gold'
          total_orders?: number
          total_spent?: number
          free_shipping_used?: number
          free_shipping_month?: string
          first_order_discount_used?: boolean
          birthday_offer_used?: string | null
          referral_code?: string | null
          referral_count?: number
          referred_by?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']> & { updated_at?: string }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          full_name: string | null
          phone: string | null
          city: string | null
          district: string | null
          street: string | null
          building: string | null
          floor: string | null
          apartment: string | null
          landmark: string | null
          is_default: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['addresses']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: string
          subtotal: number
          discount: number
          shipping: number
          total: number
          payment_method: string | null
          shipping_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']> & { updated_at?: string }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          name: string
          qty: number
          price: number
          image_url: string | null
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: never
      }
      products: {
        Row: {
          id: string
          name_en: string
          name_ar: string | null
          description_en: string | null
          description_ar: string | null
          price: number
          original_price: number | null
          stock_quantity: number
          sku: string | null
          category: string | null
          subcategory: string | null
          brand: string | null
          age_group: string | null
          gender: string
          images: Json
          tags: string[] | null
          is_active: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']> & { updated_at?: string }
      }
      reviews: {
        Row: {
          id: string
          product_id: string
          user_id: string | null
          customer_name: string
          rating: number
          title: string | null
          body: string | null
          verified: boolean
          helpful_count: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      discount_codes: {
        Row: {
          id: string
          code: string
          type: 'percentage' | 'fixed'
          value: number
          min_order: number
          max_uses: number | null
          uses_count: number
          valid_from: string | null
          valid_until: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['discount_codes']['Row'], 'id' | 'created_at' | 'uses_count'>
        Update: Partial<Database['public']['Tables']['discount_codes']['Insert']>
      }
      staff_roles: {
        Row: {
          id: string
          user_id: string
          role: 'super_admin' | 'admin' | 'staff'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['staff_roles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['staff_roles']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
