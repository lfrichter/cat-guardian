export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cats: {
        Row: {
          id: string
          name: string
          breed: string | null
          birth_date: string | null
          gender: string | null
          color_pattern: string | null
          microchip_number: string | null
          is_lost: boolean
          lost_notes: string | null
          photo_url: string | null
          owner_name: string
          owner_phone: string
          owner_email: string
          owner_id: string | null
          ai_profile_summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          breed?: string | null
          birth_date?: string | null
          gender?: string | null
          color_pattern?: string | null
          microchip_number?: string | null
          is_lost?: boolean
          lost_notes?: string | null
          photo_url?: string | null
          owner_name: string
          owner_phone: string
          owner_email: string
          ai_profile_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          breed?: string | null
          birth_date?: string | null
          gender?: string | null
          color_pattern?: string | null
          microchip_number?: string | null
          is_lost?: boolean
          lost_notes?: string | null
          photo_url?: string | null
          owner_name?: string
          owner_phone?: string
          owner_email?: string
          ai_profile_summary?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      health_records: {
        Row: {
          id: string
          cat_id: string
          record_type: string
          title: string
          description: string | null
          date_administered: string | null
          next_due_date: string | null
          vet_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cat_id: string
          record_type: string
          title: string
          description?: string | null
          date_administered?: string | null
          next_due_date?: string | null
          vet_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cat_id?: string
          record_type?: string
          title?: string
          description?: string | null
          date_administered?: string | null
          next_due_date?: string | null
          vet_name?: string | null
          created_at?: string
        }
      }
      client_errors: {
        Row: {
          id: string
          context: string
          error_message: string
          error_stack: string | null
          user_email: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          context: string
          error_message: string
          error_stack?: string | null
          user_email?: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          context?: string
          error_message?: string
          error_stack?: string | null
          user_email?: string
          metadata?: Json
          created_at?: string
        }
      }
    }
  }
}
