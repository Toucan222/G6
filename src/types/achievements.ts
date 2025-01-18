export interface UserStreak {
  id: string
  user_id: string
  current_streak: number
  longest_streak: number
  last_activity_date: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  requirement_type: 'streak' | 'cards_created' | 'decks_created'
  requirement_value: number
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}
