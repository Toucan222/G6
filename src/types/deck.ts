export interface Deck {
  id: string
  title: string
  description: string
  created_at: string
  user_id: string
  is_public: boolean
}

export interface Card {
  id: string
  deck_id: string
  title: string
  image_url: string
  quick_facts: string[]
  scoreboard: {
    [key: string]: number
  }
  content_blocks: {
    text?: string
    link?: string
    audio_url?: string
  }[]
}
