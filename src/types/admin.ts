export interface UserStats {
  total_users: number
  active_users: number
  premium_users: number
}

export interface DailyStats {
  date: string
  new_users: number
  active_users: number
  cards_created: number
  decks_created: number
}

export interface AdminProfile {
  id: string
  email: string
  role: string
  created_at: string
  last_sign_in: string
  subscription_status?: string
}
