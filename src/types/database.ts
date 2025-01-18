export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          role: string
          created_at: string
          last_sign_in: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role?: string
          created_at?: string
          last_sign_in?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role?: string
          created_at?: string
          last_sign_in?: string | null
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_customer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_customer_id?: string
          created_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          created_at: string
        }
      }
    }
  }
}
