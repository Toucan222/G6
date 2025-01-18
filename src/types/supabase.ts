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
      profiles: {
        Row: {
          id: string
          user_id: string
          role: string
          last_sign_in: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          last_sign_in?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          last_sign_in?: string | null
          created_at?: string
        }
      }
      // Add other tables as needed
    }
  }
}
